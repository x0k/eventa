import { IDateTime } from '../iterator'

import { IRule } from '../utils/schedule'

import { expression } from './expression'

export function * generator (rules: IRule[], dateTime: IterableIterator<IDateTime>) {
  const action = expression(rules)
  for (const date of dateTime) {
    yield action(date)
  }
}