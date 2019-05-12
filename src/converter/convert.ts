import {
  TValue,
  TExpression,
} from 'utils'

import {
  IConstraints,
  ISchedule,
  ICalculableSchedule,
  IEvent
} from 'utils/schedule'

import { transformPeriod } from './period'

import { expressionBuilder } from './expressionBuilder'

function addCondition (relation: string, expression: TExpression, condition: TExpression) {
  if (expression.length === 0) {
    return condition
  }
  return [ relation, [ expression, condition ] ]
}

type TNamedCondition = [TValue, TExpression]

type TConditions = Map<TValue, TExpression>

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