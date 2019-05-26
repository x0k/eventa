import { filterIterable } from 'iterator-wrapper'

import { IDateTime } from '../iterator'

import { IDictionary } from 'utils'
import { IRule } from 'utils/schedule'

import { expression } from './expression'

type TAction = (data: IDateTime) => IDictionary<any>

function * generator (action: TAction, dateTime: IterableIterator<IDateTime>) {
  for (const date of dateTime) {
    yield action(date)
  }
}

export function buildGenerator (rules: IRule[], dateTime: IterableIterator<IDateTime>, selector?: (value: IDictionary<any>) => boolean) {
  const action = expression(rules)
  const gen = generator(action, dateTime)
  return selector ? filterIterable(gen, selector) : gen
}