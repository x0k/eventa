import { TOperations } from 'rule-interpreter'

import { IPeriod, TPredicate, period } from 'utils'

import { dateTime, date, time } from 'utils/dateTime'

function evaluate<T> (handler: any, value: T) {
  return typeof handler === 'function' ? handler(value) : handler
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
  period,
  dateTime,
  date,
  time,
}