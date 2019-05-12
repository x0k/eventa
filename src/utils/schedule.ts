import { TExpression, IPeriod, TOption, IDictionary, TValue } from 'utils'

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

export interface IEventOptions {
  year?: TDateTimeOption
  month?: TDateTimeOption
  date?: TDateTimeOption
  day?: TDateTimeOption
  hour?: TDateTimeOption
  minute?: TDateTimeOption
}

export interface IEventPeriods {
  dateTimePeriod?: TDateTimePeriod
  datePeriod?: TDateTimePeriod
  timePeriod?: TDateTimePeriod
}

export type TEventConstraints = IDictionary<TOption<TValue>> & IEventOptions & IEventPeriods

export interface IEvent {
  data: IDictionary<TValue>
  includes?: TEventConstraints
  excludes?: TEventConstraints
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