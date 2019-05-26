import { TOperations } from 'rule-interpreter'

import { IPeriod, TPredicate, period, IDictionary } from '../utils'

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

export const operations: TOperations = {
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
  period
}