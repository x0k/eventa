/** TYPES **/

export type TExpression = any[]

export type TAction = (...args: any[]) => any

export type TPredicate<T> = (value: T) => boolean
export interface IDictionary<T> {
  [key: string]: T
}

export type TOption<T> = T | T[]

// Values in schedules schemes
export type TValue = string | number | boolean

export type TValues = IDictionary<TValue>

export interface IPeriod<T> {
  start: T
  end: T
}

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
  return [start, end].map(normalizeOption)
}