import { reduceIterable } from 'iterator-wrapper'

import { IDateTime } from '../iterator'

import { IPeriod } from '../utils'
import { IConstraints } from '../utils/schedule'
import * as H from '../utils/dateTime'

import { calcStepFromConstraints } from './step'

export interface IGroupedEvent<T extends IDateTime> {
  period: IPeriod<number>
  value: T
}

export type TSeparator<T extends IDateTime> = (step: number) => (previous: IGroupedEvent<T>, current: T, index: number) => boolean

export type TMerge<T extends IDateTime> = (previous: T, current: T) => T

function reducer<T extends IDateTime> (merge: TMerge<T>) {
  return (event: IGroupedEvent<T> | undefined, current: T) => {
    if (event === undefined) {
      const { milliseconds: ms } = current
      return { value: current, period: { start: ms, end: ms } }
    }
    const { value, period: { start } } = event
    const end: number = current.milliseconds
    return { value: merge(value, current), period: { start, end } }
  }
}

export function grouper<T extends IDateTime> (
  iterable: IterableIterator<T>,
  constraints: IConstraints,
  separator: TSeparator<T>,
  merge: TMerge<T> = val => val
) {
  const step = calcStepFromConstraints(constraints) || H.minute
  const withStep = separator(step)
  const wrapper = (previous: IGroupedEvent<T> | undefined, current: T, index: number) => previous === undefined || withStep(previous, current, index)
  return reduceIterable<T, undefined | IGroupedEvent<T>>(iterable, wrapper, reducer(merge), undefined)
}