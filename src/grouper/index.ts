import { reduceIterable } from 'iterator-wrapper'

import { IConstraints } from 'utils/schedule'
import { IPeriod } from 'utils'

import { IDateTime } from 'iterator'

import * as H from 'utils/dateTime'

import { calcStepFromConstraints } from './step'

export interface IGroupedEvent<T extends IDateTime> {
  period: IPeriod<number>
  value?: T
}

type TSeparator<T extends IDateTime> = (step: number) => (previous: IGroupedEvent<T>, current: T) => boolean

type TMerge<T extends IDateTime> = (previous: T, current: T) => T

function reducer<T extends IDateTime> (merge: TMerge<T>) {
  return ({ period: { start }, value }: IGroupedEvent<T>, current: T) => {
    if (value === undefined) {
      const { milliseconds: ms } = current
      return { value: current, period: { start: ms, end: ms } }
    }
    const end: number = current.milliseconds
    return { value: merge(value, current), period: { start, end } }
  }
}

export function grouper<T extends IDateTime> (iterable: IterableIterator<T>, constraints: IConstraints, separator: TSeparator<T>, merge: TMerge<T>) {
  const step = calcStepFromConstraints(constraints) || H.minute
  return reduceIterable(iterable, separator(step), reducer(merge), { period: { start: 0, end: 0 } })
}