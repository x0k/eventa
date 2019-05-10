import { IPeriod } from 'types'

export function time (hours: number, minutes: number) {
  return Date.UTC(0, 0, 1, hours, minutes)
}

export function date (month: number, date: number) {
  return Date.UTC(0, month, date)
}

export function dateTime (year: number, month: number, date?: number, hours?: number, minutes?: number) {
  return Date.UTC(year, month, date, hours, minutes)
}

export function period<T> (start: T, end: T): IPeriod<T> {
  return { start, end }
}