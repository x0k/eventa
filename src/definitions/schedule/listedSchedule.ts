import {
  TValues,
  TOption,
  IPeriod,
  IDictionary
} from 'definitions'

import { ICommonSchedule } from './commonSchedule'

type TDateTimePeriod = IPeriod<TOption<number>>

type TDateOption = TOption<number>

export interface IListedEventOptions extends IDictionary<TDateOption | undefined> {
  year?: TDateOption
  month?: TDateOption
  date?: TDateOption
  day?: TDateOption
  hour?: TDateOption
  minute?: TDateOption
}

export interface IListedEventPeriods extends IDictionary<TDateTimePeriod | undefined> {
  dateTimePeriod?: TDateTimePeriod
  datePeriod?: TDateTimePeriod
  timePeriod?: TDateTimePeriod
}

type TListedEventRules = IDictionary<TOption<TValues> | undefined>

export type TListedEventConstraints = IListedEventOptions & IListedEventPeriods & TListedEventRules

export interface IListedEvent {
  includes?: TListedEventConstraints
  excludes?: TListedEventConstraints
  data: IDictionary<TValues>
}

export interface IListedSchedule extends ICommonSchedule {
  fields: string[]
  events: IListedEvent[]
}