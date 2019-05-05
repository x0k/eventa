import { TExpression, IDictionary } from 'definitions'
import { ICommonSchedule } from './commonSchedule'

export interface IConstraint {
  step?: number | TExpression
  expression?: TExpression
}

export interface IConstraints extends IDictionary<IConstraint | undefined> {
  year?: IConstraint
  month?: IConstraint
  day?: IConstraint
  hour?: IConstraint
  minute?: IConstraint
}

export interface ISchedule extends ICommonSchedule {
  constraints: IConstraints;
}