import {
  TValue,
  TExpression
} from 'utils'

import { IRule } from 'utils/schedule'

import { IEvent, addCondition } from './utils'

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
  buildExpression: (event: IEvent) => TExpression
): (field: string) => IRule {
  const expressions: TExpression[] = events.map(buildExpression)
  return (field: string) => {
    const valuesReduce = valueReducer(field, expressions)
    const values = events.reduce(valuesReduce, new Map())
    const expression = Array.from(values.entries()).reduceRight((acc, [ value, expression ]) =>
      // @ts-ignore
      addCondition('@case', expression.concat(value), acc), [ '@default', [ false ] ])
    const names = events.reduce((acc: string[], { rules }) => {
      if (rules) {
        const { includes, excludes } = rules
        return acc.concat([includes, excludes].reduce((acc: string[], constraint) => {
          if (constraint) {
            return acc.concat(Object.keys(constraint))
          }
          return acc
        }, []))
      }
      return acc
    }, [])
    const require = Array.from(new Set(names))
    return {
      id: field,
      expression,
      require
    }
  }
}