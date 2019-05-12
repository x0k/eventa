import { TExpression, IPeriod, TOption, IDictionary, TValues } from 'utils'

import { TDateTime } from 'utils/dateTime'

export interface IConstraint {
  step?: number | TExpression;
  expression?: TExpression;
}

export interface IConstraints {
  [name: string]: IConstraint
}

export type TDateTimeOption = number | TDateTime

export type TDateTimePeriod = IPeriod<TDateTimeOption>

export interface IEventOptions extends IDictionary<TDateTimeOption | undefined> {
  year?: TDateTimeOption
  month?: TDateTimeOption
  date?: TDateTimeOption
  day?: TDateTimeOption
  hour?: TDateTimeOption
  minute?: TDateTimeOption
}

export interface IEventPeriods extends IDictionary<TDateTimePeriod | undefined> {
  dateTimePeriod?: TDateTimePeriod
  datePeriod?: TDateTimePeriod
  timePeriod?: TDateTimePeriod
}

export type TEventConstraints = IEventOptions & IEventPeriods & IDictionary<TOption<TValues>>

export interface IEvent {
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