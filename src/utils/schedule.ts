import { TExpression, IPeriod, TOption, IDictionary, TValues } from 'utils'

export interface IConstraint {
  step?: number | TExpression;
  expression?: TExpression;
}

export interface IConstraints {
  [name: string]: IConstraint
}

export type TDateTime = TOption<number>

export type TDateTimePeriod = IPeriod<TDateTime>

export interface IEventOptions extends IDictionary<TDateTime | undefined> {
  year?: TDateTime
  month?: TDateTime
  date?: TDateTime
  day?: TDateTime
  hour?: TDateTime
  minute?: TDateTime
}

export interface IEventPeriods extends IDictionary<TDateTimePeriod | undefined> {
  dateTimePeriod?: TDateTimePeriod
  datePeriod?: TDateTimePeriod
  timePeriod?: TDateTimePeriod
}

export type TEventConstraints = IEventOptions & IEventPeriods & IDictionary<TOption<TValues>>

interface IEvent {
  data: IDictionary<TValues>
  includes: TEventConstraints
  excludes: TEventConstraints
}

export interface IRule {
  id: string;
  expression: TExpression;
  require?: string[];
}

export interface ISchedule {
  name: string
  period: TDateTimePeriod
  fields: string[]
  events: IEvent[]
  rules: IRule[]
}

export interface ICalculableSchedule {
  name: string
  period: IPeriod<number>
  rules: IRule[]
  constraints: IConstraints
}