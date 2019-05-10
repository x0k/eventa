import { TOperations } from 'rule-interpreter'

import { IPeriod, TPredicate, period } from 'utils'

import { dateTime, date, time } from 'utils/dateTime'

type THandler<T> = (value: T) => any | T

interface IMatch<T> {
  case: (predicate: (value: T) => boolean, handler: THandler<T>) => IMatch<T>
  default: (handler: THandler<T>) => any
}

function matched<T> (value: T): IMatch<T> {
  return {
    case: () => matched(value),
    default: () => value
  }
}

const evalResult = <T>(handler: THandler<T>, value: T) => typeof handler === 'function' ? handler(value) : handler

function match<T> (value: T): IMatch<T> {
  return {
    case (predicate: TPredicate<T>, handler: THandler<T>) {
      if (predicate(value)) {
        return matched(evalResult(handler, value))
      }
      return match(value)
    },
    default (handler) {
      return evalResult(handler, value)
    } 
  }
}

export const operations: TOperations = {
  match,
  case<T> (predicate: TPredicate<T>, handler: THandler<T>, el: IMatch<T>): IMatch<T> {
    return el.case(predicate, handler)
  },
  default<T> (handler: THandler<T>, el: IMatch<T>) {
    return el.default(handler)
  },
  in<T> ({ start, end }: IPeriod<T>, value: T) {
    return start <= value && value <= end
  },
  period,
  dateTime,
  date,
  time
}