import buildActions from 'rule-interpreter'

import { TExpression } from 'types'

import { IOperations } from './types'

export const operations: IOperations = {
  '=': (a, b) => a === b,
  '!': (operand) => !operand,
  '&': (...list) => {
    if (list.length && list.every(element => Boolean(element))) {
      return list[list.length - 1]
    }
    return false;
  },
  '|': (...list) => list.find(element => Boolean(element)) || false,
  'in': (range, element) =>  range.includes(element)
}

export function buildAction (expression: TExpression) {
  return buildActions(expression, operations)[0]
}