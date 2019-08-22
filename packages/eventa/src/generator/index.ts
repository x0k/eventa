import { filterIterable } from 'iterator-wrapper'

import { IDateTime } from '../iterator'

import { TPredicate } from '../utils'

import { IRule } from '../utils/schedule'

import { expression } from './expression'

type TAction<T extends IDateTime> = (data: IDateTime) => T

function * generator<T extends IDateTime> (
  action: TAction<T>,
  dateTime: IterableIterator<IDateTime>
): IterableIterator<T> {
  for (const date of dateTime) {
    yield action(date)
  }
}

export function buildGenerator<T extends IDateTime> (
  rules: IRule[],
  dateTime: IterableIterator<IDateTime>,
  selector?: TPredicate<T>
): IterableIterator<T> {
  const action = expression<T>(rules)
  const gen = generator<T>(action, dateTime)
  return selector ? filterIterable(gen, selector) : gen
}

export { TPredicate, IRule }