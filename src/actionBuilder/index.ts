import { buildActionsBuilder } from 'rule-interpreter'

import { TExpression, TAction } from 'types'

import { operations } from './operations'

const actionsBuilder = buildActionsBuilder(operations)

export function buildAction(expression: TExpression): TAction {
  return actionsBuilder(expression)[0]
}