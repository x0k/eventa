import { buildAction } from '../actionBuilder'

import { IDateTime } from '../iterator'

import { IRule } from '../utils/schedule'

function order (rules: IRule[]): IRule[] {
  const order: IRule[] = []
  const names = new Set()
  let queue = []

  const add = (rule: IRule) => {
    order.push(rule)
    names.add(rule.id)
  }

  for (const rule of rules) {
    const { require } = rule
    if (require && !require.every(key => names.has(key))) {
      queue.push(rule)
      continue
    }
    add(rule)
  }

  while (queue.length) {
    const del = new Set()
    for (const rule of queue) {
      const { require } = rule
      if (require && require.every(key => names.has(key))) {
        add(rule)
        del.add(rule)
      }
    }
    queue = queue.filter(rule => !del.has(rule))
  }

  return order
}

function build ({ id, expression }: IRule) {
  return { id, action: buildAction(expression) }
}

export function expression<T extends IDateTime> (rules: IRule[]) {
  const rulesOrder = order(rules)
  const expressions = rulesOrder.map(build)
  return (data: IDateTime) => expressions.reduce((acc: IDateTime, { id, action }) => {
    acc[id] = action(acc)
    return acc
  }, data) as T
}