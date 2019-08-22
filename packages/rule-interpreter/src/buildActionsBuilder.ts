import {
  IDictionary,
  TOperations,
  TExpression
} from './types'

import { buildActionsReducer } from './buildActionsReducer'

function setPrefix<T> (dictionary: IDictionary<T>, prefix: string) {
  const prefixSetter = (acc: IDictionary<T>, key: string) => ({ ...acc, [prefix + key]: dictionary[key] })
  return Object.keys(dictionary).reduce(prefixSetter, {})
}

interface IOptions {
  actionsPrefix?: string
  operationsPrefix?: string
}

export function buildActionsBuilder (operations: TOperations, options: IOptions = {}) {
  const { actionsPrefix = '$', operationsPrefix = '@' } = options

  if (actionsPrefix === operationsPrefix) {
    throw new Error('Identical prefixes are not allowed')
  }

  const operationsWithPrefix = setPrefix(operations, operationsPrefix)

  const actionsReducer = buildActionsReducer(actionsPrefix, operationsWithPrefix)

  return (expression: TExpression) => expression.reduceRight(actionsReducer, [])
}
