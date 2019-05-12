import {
  TExpression,
  TOption,
  IDictionary,
  IPeriod
} from 'utils'

import { IEvent, TEventConstraints } from 'utils/schedule'

function addCondition (relation: string, expression: TExpression, condition: TExpression) {
  if (expression.length === 0) {
    return condition
  }
  return [ relation, expression.concat(condition) ]
}

type TConditionBuilder = (value: any, key: string) => TExpression

function reducerBuilder (constraints: TEventConstraints) {
  return (conditionBuilder: TConditionBuilder) =>
    (expression: TExpression, key: string) => constraints[key]
      ? addCondition('@and', expression, conditionBuilder(constraints[key], key))
      : expression
}

function buildConstraintsReducer (
  constraints: TEventConstraints,
  periodConditionBuilder: TConditionBuilder,
  optionConditionBuilder: TConditionBuilder
) {
  return (periods: IDictionary<string>, options: string[], rules: string[], defaultValue: TExpression) => {
    const build = reducerBuilder(constraints)
    const periodReducer = build(periodConditionBuilder)
    const optionReducer = build(optionConditionBuilder)
    return rules.reduce(
      optionReducer,
      options.reduce(
        optionReducer,
        Object.keys(periods).reduce(
          periodReducer,
          defaultValue
        )
      )
    )
  }
}

function conditionBuilder(key: string, expression: TExpression) {
  return [ '$>>', '@get', [ key ] ].concat(expression)
}

function transformOption<T> (option: TOption<T>) {
  return Array.isArray(option)
    ? [ '@includes', [ option ] ]
    : [ '@equal', [ option ] ]
}

export function expressionBuilder (rules: string[]) {

  const periods: IDictionary<string> = {
    'dateTimePeriod': 'dateTime',
    'datePeriod': 'date',
    'timePeriod': 'time'
  }

  const options = ['year', 'month', 'date', 'day', 'hour', 'minute']

  const periodConditionBuilder = <T>(period: IPeriod<T>, key: string) =>
    conditionBuilder(key, [ '@in', period ])

  const optionConditionBuilder = <T>(option: TOption<T>, key: string): TExpression => 
    conditionBuilder(key, transformOption(option))
  
  const invert = (conditionBuilder: TConditionBuilder) =>
    (value: any, key: string) => [ '@not', conditionBuilder(value, key) ]

  const eventReducer = (event: IEvent) => (expression: TExpression, key: string) => {
    switch (key) {
      case 'includes':{
        // @ts-ignore
        const reducer = buildConstraintsReducer(event.includes, periodConditionBuilder, optionConditionBuilder)
        return reducer(periods, options, rules, expression)
      }
      case 'excludes':{
        // @ts-ignore
        const reducer = buildConstraintsReducer(event.excludes, invert(periodConditionBuilder), invert(optionConditionBuilder))
        return reducer(periods, options, rules, expression)
      }
      default:
        return expression
    }
  }

  return (event: IEvent): TExpression => Object.keys(event).reduce(eventReducer(event), [])
}