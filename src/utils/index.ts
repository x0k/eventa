import { TExpression } from 'rule-interpreter'

/** TYPES **/

export { TExpression }

export type TAction = (...args: any[]) => any

export type TPredicate<T> = (value: T) => boolean
export interface IDictionary<T> {
  [key: string]: T
}

export type TOption<T> = T | T[]

// Values in schedules schemes
export type TValue = string | number | boolean

export interface IPeriod<T> {
  start: T
  end: T
}

export type TPair<T> = [ T, T ]

/** FUNCTIONS **/

export function isNumber<T> (data: number | T): data is number {
  return typeof data === 'number'
}

export function period<T> (start: T, end: T): IPeriod<T> {
  return { start, end }
}

export function normalizeOption<T> (option: TOption<T>) {
  return Array.isArray(option) ? option : [option]
}

export function periodToArray<T> ({ start, end }: IPeriod<T>) {
  return [start, end]
}

/** Errors **/

export function typeError (expected: string, element: any) {
  return new TypeError(`Expected ${expected}, but got ${typeof element}: ${element}`)
}