import {
  IDictionary,
  IPeriod,
  TOption,
  TValue,
  TExpression
} from 'utils'

import { TDateTime } from 'utils/dateTime'

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

export function addCondition (relation: string, expression: TExpression, condition: TExpression) {
  if (expression.length === 0) {
    return condition
  }
  return [ relation, expression.concat(condition) ]
}