import {
  TExpression,
  TOption,
  IDictionary,
  IPeriod,
  typeError
} from '../utils'

import {
  IEvent,
  IEventConstraints,
  addCondition
} from './utils'

type TReducer<T> = (dictionary: IDictionary<T>) => (acc: TExpression, key: string) => TExpression

function reduce<T> (dictionary: IDictionary<T>, reducer: TReducer<T>) {
  return Object.keys(dictionary).reduce(reducer(dictionary), [])
}

function reduceConstraints<T, D extends IDictionary<T>> (constraints: IEventConstraints<D>, buildCondition: (constraint: D) => TExpression) {
  const reducer = (expression: TExpression, key: string) => {
    switch (key) {
      case 'includes': {
        const { includes } = constraints
        if (includes) {
          return addCondition('@and', expression, buildCondition(includes))
        }
        throw typeError('Includes constraints', includes)
      }
      case 'excludes': {
        const { excludes } = constraints
        if (excludes) {
          return addCondition('@and', expression, [ '@not', buildCondition(excludes) ])
        }
        throw typeError('Excludes constraints', excludes)
      }
      default:
        return expression
    }
  }
  return Object.keys(constraints).reduce(reducer, [])
}

function transformOption<T> (option: TOption<T>) {
  return Array.isArray(option)
    ? [ '@includes', [ option ] ]
    : [ '@equal', [ option ] ]
}

function buildCondition (key: string, expression: TExpression) {
  return [ '$>>', '@get', [ key ] ].concat(expression)
}

function buildReducer<T> (buildExpression: (value: T) => TExpression): TReducer<T> {
  return (constraints: IDictionary<T>) =>
    (expression: TExpression, key: string) =>
      addCondition('@and', expression, buildCondition(key, buildExpression(constraints[key])))
}

function buildConditionBuilder<T> (buildExpression: (value: T) => TExpression) {
  const reducer = buildReducer(buildExpression)
  return (dictionary: IDictionary<T>) => reduce(dictionary, reducer)
}

const buildOptionsExpression = buildConditionBuilder(transformOption)
const buildPeriodsExpression = buildConditionBuilder(<T>(period: IPeriod<T>) => [ '@in', period ])

function eventReducer (event: IEvent) {
  return (expression: TExpression, key: string) => {
    switch (key) {
      case 'options': {
        const { options } = event
        if (options) {
          // @ts-ignore
          return addCondition('@and', expression, reduceConstraints(options, buildOptionsExpression))
        }
        throw typeError('Options constraints', options)
      }
      case 'periods': {
        const { periods } = event 
        if (periods) {
          // @ts-ignore
          return addCondition('@and', expression, reduceConstraints(periods, buildPeriodsExpression))
        }
        throw typeError('Periods constraints', periods)
      }
      case 'rules': {
        const { rules } = event
        if (rules) {
          return addCondition('@and', expression, reduceConstraints(rules, buildOptionsExpression))
        }
      }
      default:
        return expression
    }
  }
}

export function buildExpression (event: IEvent) {
  // @ts-ignore
  return reduce(event, eventReducer)
}