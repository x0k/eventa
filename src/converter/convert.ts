import {
  TValues,
  TOption,
  TExpression,
  IPeriod
} from 'utils'

import {
  IConstraints,
  ISchedule,
  ICalculableSchedule
} from 'utils/schedule'

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

function buildReducerBuilder (constraints: TListedEventConstraints) {
  return (conditionBuilder: TConditionBuilder) =>
    (expression: TExpression, key: string) => constraints[key]
      ? addCondition('@&', expression, conditionBuilder(constraints[key], key))
      : expression
}

function buildConstraintsReducer (
  constraints: TListedEventConstraints,
  periodConditionBuilder: TConditionBuilder,
  optionConditionBuilder: TConditionBuilder
) {
  return (periods: IPeriods, options: string[], rules: string[], defaultValue: TExpression) => {
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

function buildExpressionBuilder (rules: string[]) {
  return ({ includes, excludes }: IListedEvent): TExpression => {
    const periods: IPeriods = {
      'dateTimePeriod': 'dateTime',
      'datePeriod': 'fullDate',
      'timePeriod': 'time'
    }
    const options = ['year', 'month', 'date', 'day', 'hour', 'minute']

    const periodConditionBuilder = <T>(period: IPeriod<T>, key: string) =>
      [ '@in', key, ...periodToArray(period), `%${periods[key]}` ]
    const optionConditionBuilder = <T>(option: TOption<T>, key: string): TExpression => Array.isArray(option)
      ? [ '@in', option, `%${key}` ]
      : [ '@=', option, `%${key}` ]
    const invert = (conditionBuilder: TConditionBuilder) =>
      (value: any, key: string) => [ '@!', ...conditionBuilder(value, key) ]

    let expression: TExpression = []

    if (includes) {
      const includesReducer = buildConstraintsReducer(includes, periodConditionBuilder, optionConditionBuilder)
      expression = includesReducer(periods, options, rules, expression)
    }

    if (excludes) {
      const excludesReducer = buildConstraintsReducer(excludes, invert(periodConditionBuilder), invert(optionConditionBuilder))
      expression = excludesReducer(periods, options, rules, expression)
    }

    return expression
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

function buildRulesBuilder (events: IListedEvent[], expressions: TExpression[]) {
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

export function convert (schedule: ISchedule): ICalculableSchedule {
  const { name, period, fields, events, rules } = schedule
  const constraints: IConstraints = {}
  const rulesKeys = rules.map(({ id }) => id)
  const expressionBuilder = buildExpressionBuilder(rulesKeys)
  const expressions: TExpression[] = events.map(expressionBuilder)
  const ruleBuilder = buildRulesBuilder(events, expressions)
  const fieldRules = fields.map(ruleBuilder)
  return { name, period, constraints, rules }
}