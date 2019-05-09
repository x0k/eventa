import { TExpression, IDictionary } from 'types'

export interface IYears extends IDictionary<number> {
  year: number
}

export interface IMonths extends IYears {
  month: number
}

export interface IDays extends IMonths {
  day: number
}

export interface IHours extends IDays {
  hour: number
}

export interface IMinutes extends IHours {
  minute: number
}

export interface IDateTime {
  minute: number
  hour: number
  day: number
  date: number
  month: number
  year: number
}

export interface IConstraint {
  step?: number | TExpression;
  expression?: TExpression;
}

export interface IConstraints {
  [name: string]: IConstraint
}