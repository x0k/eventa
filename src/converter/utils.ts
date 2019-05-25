import {
  IDictionary,
  IPeriod,
  TOption,
  TValue,
  TExpression
} from 'utils'

export type TDateTimeOption = number | number[]

export type TDateTimePeriod = IPeriod<number>

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

export interface IEventConstraints<T> extends IDictionary<T | undefined>{
  includes?: T
  excludes?: T
}
export interface IEvent {
  data: IDictionary<TValue>
  options?: IEventConstraints<IEventOptions>
  periods?: IEventConstraints<IEventPeriods>
  rules?: IEventConstraints<IDictionary<TOption<TValue>>>
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