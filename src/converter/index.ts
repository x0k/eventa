import {
  IConstraints,
  ISchedule as ICalculableSchedule,
} from '../utils/schedule'

import { ISchedule } from './utils'

import { buildExpression } from './buildExpression'

import { ruleBuilder } from './ruleBuilder'

export function convert ({ name, period, fields, events, rules }: ISchedule): ICalculableSchedule {
  const constraints: IConstraints = {}

  const buildRule = ruleBuilder(events, buildExpression)
  const fieldsRules = fields.map(buildRule)
  return {
    name,
    period,
    constraints,
    rules: rules.concat(fieldsRules)
  }
}

export { ISchedule }