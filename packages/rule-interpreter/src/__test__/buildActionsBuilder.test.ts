import { buildActionsBuilder } from '../buildActionsBuilder'

import { TExpression, IDictionary } from '../types'

type TPredicate<T> = (value: T) => boolean

interface IPeriod<T> {
  start: T
  end: T
}

function evaluate<T> (handler: any, value: T) {
  return typeof handler === 'function' ? handler(value) : handler
}

function getDateTime (key: string, dictionary: IDictionary<number>) {
  switch (key) {
    case 'time':
      return new Date(0, 0, 1, dictionary['hour'], dictionary['minute'])
    case 'date':
      return new Date(0, dictionary['month'], dictionary['day'])
    default:
      return new Date(dictionary['year'], dictionary['month'], dictionary['day'], dictionary['hour'], dictionary['minute'])
  }
}

const operations = {
  inc (step: number, value: number) {
    return value + step
  },
  sum (...numbers: number[]) {
    return numbers.reduce((sum, value) => sum + value, 0)
  },
  case<T> (predicate: TPredicate<T>, handler: any, next: (value: T) => any, value: T) {
    return predicate(value) ? evaluate(handler, value) : next(value)
  },
  default<T> (handler: any, value: T) {
    return evaluate(handler, value)
  },
  in<T> ({ start, end }: IPeriod<T>, value: T) {
    return start <= value && value <= end
  },
  or<T> (predicate: TPredicate<T>, next: (value: T) => any, value: T) {
    if (value !== undefined) {
      return evaluate(predicate, value) || evaluate(next, value)
    }
    return evaluate(predicate, next)
  },
  and<T> (predicate: TPredicate<T>, next: (value: T) => any, value: T) {
    if (value !== undefined) {
      return evaluate(predicate, value) && evaluate(next, value)
    }
    return evaluate(predicate, next)
  },
  not (handler: any, value: any) {
    return !evaluate(handler, value)
  },
  equal (expected: any, actual: any) {
    return expected === actual
  },
  includes (array: any[], value: any) {
    return array.indexOf(value) > -1
  },
  get<T> (key: string, dictionary: IDictionary<T>) {
    return dictionary[key]
  },
  dateTime (key: string, dictionary: IDictionary<number>) {
    return getDateTime(key, dictionary).getTime()
  },
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '/': (a: number, b: number) => a / b,
  '*': (a: number, b: number) => a * b,
  '=': (a: number, b: number) => a === b,
  '%': (a: number, b: number) => a % b,
  '!': (operand: any) => !operand,
  condition (value: number) {
    return value > 10
  },
}

const actionsBuilder = buildActionsBuilder(operations)

function buildAction (expression: TExpression) {
  return actionsBuilder(expression)[0]
}

test('Map action', () => {
  const expression = [ '$map', [1, 2, 3], '@inc', [3] ]
  const action = buildAction(expression)
  expect(action).toEqual([4, 5, 6])
})

test('Eval action', () => {
  const expression = [ '$eval', '@sum', [1, 2, 3] ]
  const action = buildAction(expression)
  expect(action).toBe(6)
})

test('Simple arithmetic', () => {
  const expression = [ '@-', [ 2, 1 ] ]
  const action = buildAction(expression)
  expect(action()).toBe(1)
})

test('Arithmetic with variable', () => {
  const expression = [ '@/', [ 20 ] ]
  const action = buildAction(expression)
  expect(action(4)).toBe(5)
})

test('Logical expression', () => {
  const expression = [ '@or', [ false, '@and', [ '@condition', [], true ] ] ]
  const action = buildAction(expression)
  expect(action(11)).toBe(true)
})

test('Case operation', () => {
  const expression = [
    '$>>', '@dateTime', ['time'],
    "@case", ["@in", [{ "start": -2208969017000, "end": -2208963617000 }], 1,
      "@case", ["@in", [{ "start": -2208963017000, "end": -2208957617000 }], 2,
        "@case", ["@in", [{ "start": -2208957017000, "end": -2208951617000 }], 3,
          "@case", ["@in", [{ "start": -2208948017000, "end": -2208942617000 }], 4,
            "@case", ["@in", [{ "start": -2208942017000, "end": -2208936617000 }], 5,
              "@case", ["@in", [{ "start": -2208936017000, "end": -2208930617000 }], 6,
                "@case", ["@in", [{ "start": -2208930017000, "end": -2208924617000 }], 7,
                  "@case", ["@in", [{ "start": -2208924017000, "end": -2208918617000 }], 8,
                    "@default", [false] ] ] ] ] ] ] ] ]
  ]
  const action = buildAction(expression)
  const date = { minute: 0, hour: 18, day: 6, month: 4, year: 2019 }
  expect(action(date)).toBe(6)
})

test('Should decode object properties', () => {
  const expression = [{
    exp1: [ '@-', [ 2, 1 ] ],
    exp2: [ '@/', [ 20 ] ],
    exp3: [ '@or', [ false, '@and', [ '@condition', [], true ] ] ],
  }]
  const args = [ [], [ 4 ], [ 11 ] ]
  const action = buildAction(expression)
  const values = Object.keys(action)
    .map(key => action[key])
    .map(([handler], i) => handler(...args[i]))
  expect(values).toEqual([ 1, 5, true ])
})