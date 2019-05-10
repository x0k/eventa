export type TExpression = any[]

export type TAction = (...args: any[]) => any
export interface IDictionary<T> {
  [key: string]: T
}

export type TOption<T> = T | T[]

// Values in schedules schemes
export type TValue = string | number | boolean

// 
export interface IPeriod<T> {
  start: T
  end: T
}

export interface IRange<T> extends IPeriod<T> {
  includes: (element: T) => boolean
}

export type TValues = IDictionary<TValue>