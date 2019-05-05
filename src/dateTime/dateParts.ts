import { getMonthLength } from './dateHelper'

import {
  IYears,
  IMonths,
  IDays,
  IHours
} from 'definitions/dateTime'

export const isNumber = <T>(data: number | T): data is number => typeof data === 'number'

export function * years (value: number) {
  while (true) {
    yield { year: value++ }
  }
}
export function * months (value: number, { year }: IYears) {
  while (value < 12) {
    yield { month: value++, year }
  }
  return value % 12
}
export function * days (value: number, data: IMonths | number) {
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
export function * hours (value: number, data: IDays | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  while (value < 24) {
    yield { hour: value++, ...data }
  }
  return value % 24
}
export function * minutes (value: number, data: IHours | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  while (value < 60) {
    yield { minute: value++, ...data }
  }
  return value % 60
}