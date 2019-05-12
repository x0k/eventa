import {
  TValue,
  TExpression,
} from 'utils'

import { IRule } from 'utils/schedule'

import { IEvent } from './utils'

import { addCondition } from './utils'

function requireReducer (filterKeys: (acc: string[], keys: string[]) => string[]) {
  return (acc: string[], { excludes, includes }: IEvent) => acc.concat([excludes, includes]
    .filter(el => Boolean(el))
    // @ts-ignore
    .map(el => Object.keys(el))
    .reduce(filterKeys, []))
}

function valueReducer (field: string, expressions: TExpression[]) {
  return (map: Map<TValue, TExpression>, { data: { [field]: value } }: IEvent, index: number) => {
    const condition = expressions[index]
    if (map.has(value)) {
      // @ts-ignore
      return map.set(value, addCondition('@or', map.get(value), condition))
    }
    return map.set(value, condition)
  }
}

export function ruleBuilder (
  events: IEvent[],
  rules: Set<string>,
  buildExpression: (event: IEvent) => TExpression
): (field: string) => IRule {
  const expressions: TExpression[] = events.map(buildExpression)
  const filterKeys = (acc: string[], keys: string[]) => acc.concat(keys.filter(key => rules.has(key)))
  return (field: string) => {
    const valuesReduce = valueReducer(field, expressions)
    const values = events.reduce(valuesReduce, new Map())
    const expression = Array.from(values.entries()).reduceRight((acc, [ value, expression ]) =>
      // @ts-ignore
      addCondition('@case', [expression, value], acc), [ '@default', false ])
    const requireReduce = requireReducer(filterKeys)
    const require = events.reduce(requireReduce, [])
    return {
      id: field,
      expression,
      require
    }
  }
}