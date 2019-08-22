import { operators } from './operators'

import { buildActionsBuilder } from 'rule-interpreter'

const actionsBuilder = buildActionsBuilder(operators)

export function buildElementBuilder (expression) {
  return actionsBuilder(expression)[0]
}
