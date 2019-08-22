import {
  TExpression,
  TOption,
  IDictionary,
  typeError
} from '../utils'

import {
  IEvent,
  IEventConstraints,
  addCondition,
  TDateTimePeriod
} from './utils'

type TReducer<T> = (dictionary: IDictionary<T>) => (acc: TExpression, key: string) => TExpression

function reduce<T> (dictionary: IDictionary<T>, reducer: TReducer<T>) {
  return Object.keys(dictionary).reduce(reducer(dictionary), [])
}

function reduceConstraints<T> (constraints: IEventConstraints<T>, buildCondition: (constraint: T) => TExpression) {
  const { includes, excludes } = constraints
  const conditions = []
  if (includes) {
    conditions.push(buildCondition(includes))
  }
  if (excludes) {
    conditions.push([ '@not', buildCondition(excludes) ])
  }
  return conditions.reduce((expression, condition) => addCondition('@and', expression, condition))
}

function transformOption<T> (option: TOption<T> | undefined) {
  if (option) {
    return Array.isArray(option) ? [ '@includes', [ option ] ] : [ '@equal', [ option ] ]
  }
  throw typeError('Option', option)
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
const buildPeriodsExpression = buildConditionBuilder((period: TDateTimePeriod | undefined) => [ '@in', period ])

export function buildExpression (event: IEvent) {
  const { options, periods, rules } = event
  const conditions = []
  if (options) {
    conditions.push(reduceConstraints(options, buildOptionsExpression))
  }
  if (periods) {
    conditions.push(reduceConstraints(periods, buildPeriodsExpression))
  }
  if (rules) {
    conditions.push(reduceConstraints(rules, buildOptionsExpression))
  }
  return conditions.reduce((expression, condition) => addCondition('@and', expression, condition))
}