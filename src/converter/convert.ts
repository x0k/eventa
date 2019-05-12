import {
  TValues,
  TOption,
  TExpression,
  IPeriod,
  IDictionary
} from 'utils'

import {
  IConstraints,
  ISchedule,
  ICalculableSchedule,
  IEvent,
  TEventConstraints
} from 'utils/schedule'

import { transformPeriod } from './period'

function addCondition (relation: string, expression: TExpression, condition: TExpression) {
  switch (expression.length) {
    case 0: {
      return condition
    }
    default: {
      if (expression[0] !== relation) {
        return [relation, expression.concat(condition)]
      }
      const [, data] = expression
      return [relation, data.concat(condition)]
    }
  }
}

type TConditionBuilder = (value: any, key: string) => TExpression

function buildReducerBuilder (constraints: TEventConstraints) {
  return (conditionBuilder: TConditionBuilder) =>
    (expression: TExpression, key: string) => constraints[key]
      ? addCondition('@&', expression, conditionBuilder(constraints[key], key))
      : expression
}

function buildConstraintsReducer (
  constraints: TEventConstraints,
  periodConditionBuilder: TConditionBuilder,
  optionConditionBuilder: TConditionBuilder
) {
  return (periods: IDictionary<string>, options: string[], rules: string[], defaultValue: TExpression) => {
    const reducerBuilder = buildReducerBuilder(constraints)
    const periodReducer = reducerBuilder(periodConditionBuilder)
    const optionReducer = reducerBuilder(optionConditionBuilder)
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

type TNamedCondition = [TValues, TExpression]

type TConditions = Map<TValues, TExpression>

function joinExpression (conditions: TConditions): TExpression {
  const map = (acc: TExpression, [ value, expression ]: TNamedCondition) => {
    if (expression[0] === '@&') {
      const [, data] = expression
      return [...acc, '@&', data.concat(value)]
    }
    return [...acc, '@&', [...expression, value]]
  }

  const routes = Array.from(conditions.entries())
    .reduce(map, [])

  if (routes.length > 1) {
    return ['@|', ...routes]
  }
  return routes
}

function rulesBuilder (events: IEvent[], expressions: TExpression[]) {
  return (field: string) => {
    const conditions: TConditions = new Map()
    for (let i = 0; i < events.length; i++) {
      const value = events[i].data[field]
      const condition = conditions.get(value)
      if (condition) {
        conditions.set(value, addCondition('@|', condition, expressions[i]))
      } else {
        conditions.set(value, expressions[i])
      }
    }
    return {
      id: field,
      expression: joinExpression(conditions)
    }
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

function expressionBuilder (rules: string[]) {

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
        const reducer = buildConstraintsReducer(event.includes, periodConditionBuilder, optionConditionBuilder)
        return reducer(periods, options, rules, expression)
      }
      case 'excludes':{
        const reducer = buildConstraintsReducer(event.excludes, invert(periodConditionBuilder), invert(optionConditionBuilder))
        return reducer(periods, options, rules, expression)
      }
      default:
        return expression
    }
  }

  return (event: IEvent): TExpression => Object.keys(event).reduce(eventReducer(event), [])
}

export function convert ({ name, period, fields, events, rules }: ISchedule): ICalculableSchedule {
  const constraints: IConstraints = {}

  const rulesKeys = rules.map(({ id }) => id)
  const build = expressionBuilder(rulesKeys)
  const expressions: TExpression[] = events.map(build)
  console.log(expressions)
  // const ruleBuilder = rulesBuilder(events, expressions)
  // const fieldRules = fields.map(ruleBuilder)
  return {
    name,
    period: transformPeriod(period),
    constraints,
    rules
  }
}