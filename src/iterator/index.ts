import { wrap, restrict } from 'iterator-wrapper'

import { TExpression } from 'types'

import { buildAction } from 'actionBuilder'

import {
  IConstraints,
  IYears,
  IMonths,
  IDays,
  IHours,
  IMinutes,
  IConstraint
} from './types'

import { getMonthLength } from './dateHelper'

const isNumber = <T>(data: number | T): data is number => typeof data === 'number'

function buildIncrementor (step: number | TExpression) {
  return isNumber(step)
    ? (value: number) => value + step
    : bu
}

function * years (value: number) {
  while (true) {
    yield { year: value++ }
  }
}
function * months (value: number, { year }: IYears) {
  while (value < 12) {
    yield { month: value++, year }
  }
  return value % 12
}
function * days (value: number, data: IMonths | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  const { year, month } = data
  const len = getMonthLength(year, month)
  while (value < len) {
    yield { day: value++, month, year }
  }
  return value % len
}
function * hours (value: number, data: IDays | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  while (value < 24) {
    yield { hour: value++, ...data }
  }
  return value % 24
}

function buildMinutes (constraint: IConstraint) {
  const { step, expression } = constraint
  if () {

  }
  return function * minutes (value: number, data: IHours | number) {
    if (isNumber(data)) {
      throw new Error('Type error')
    }
    while (value < 60) {
      yield { minute: value++, ...data }
    }
    return value % 60
  }
}

function toMinutes(date: Date): IMinutes {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  }
}

export function buildIterator (start: Date, end: Date, constraints: IConstraints) {
  const condition = (date: IMinutes | number) => !isNumber(date) && (
    date.year < end.getFullYear() ||
    date.month < end.getMonth() ||
    date.day < end.getDate() ||
    date.hour < end.getHours() ||
    date.minute <= end.getMinutes()
  )
  const from = toMinutes(start)

  return restrict<IMinutes | number>(
    wrap<IHours | number, number, IMinutes>(
      wrap<IDays | number, number, IHours>(
        wrap<IMonths | number, number, IDays>(
          wrap<IYears, number, IMonths>(
            years(from.year),
            months,
            from.month
          ),
          days,
          from.day
        ),
        hours,
        from.hour
      ),
      minutes,
      from.minute
    ),
    condition
  )
}