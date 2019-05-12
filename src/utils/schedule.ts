import { TExpression, IPeriod } from 'utils'

export interface IConstraint {
  step?: number | TExpression;
  expression?: TExpression;
}

export interface IConstraints {
  [name: string]: IConstraint
}

export interface IRule {
  id: string;
  expression: TExpression;
  require?: string[];
}

export interface ISchedule {
  name: string
  period: IPeriod<number>
  rules: IRule[]
  constraints: IConstraints
}