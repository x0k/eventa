import {
  IConstraints,
  ISchedule as ICalculableSchedule,
} from 'utils/schedule'

import { ISchedule } from './utils'

import { transformPeriod } from './period'

import { expressionBuilder } from './expressionBuilder'

import { ruleBuilder } from './ruleBuilder'

export function convert ({ name, period, fields, events, rules }: ISchedule): ICalculableSchedule {
  const constraints: IConstraints = {}

  const rulesKeys = rules.map(({ id }) => id)
  const buildExpression = expressionBuilder(rulesKeys)
  const buildRule = ruleBuilder(events, new Set(rulesKeys), buildExpression)
  const fieldsRules = fields.map(buildRule)
  return {
    name,
    period: transformPeriod(period),
    constraints,
    rules: rules.concat(fieldsRules)
  }
}