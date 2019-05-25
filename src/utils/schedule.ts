import { TExpression, IPeriod, IDictionary } from 'utils'

export interface IConstraint {
  step?: number | TExpression;
  expression?: TExpression;
}

export interface IConstraints extends IDictionary<IConstraint | undefined> {
  year?: IConstraint
  month?: IConstraint
  date?: IConstraint
  hour?: IConstraint
  minute?: IConstraint
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