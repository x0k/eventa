import { TExpression, IPeriod, IDictionary } from '../utils'

export interface IConstraint {
  step?: number | TExpression;
  expression?: TExpression;
}

export const YEAR = 'year'
export const MONTH = 'month'
export const DATE = 'date'
export const DAY = 'day'
export const HOUR = 'hour'
export const MINUTE = 'minute'

export const DATE_PARTS = [ YEAR, MONTH, DATE, HOUR, MINUTE ]

export interface IConstraints extends IDictionary<IConstraint | undefined> {
  [YEAR]?: IConstraint
  [MONTH]?: IConstraint
  [DATE]?: IConstraint
  [HOUR]?: IConstraint
  [MINUTE]?: IConstraint
}

export interface IRule {
  id: string
  expression: TExpression
  require?: string[]
}

export interface ISchedule {
  name: string
  period: IPeriod<number>
  rules: IRule[]
  constraints: IConstraints
}