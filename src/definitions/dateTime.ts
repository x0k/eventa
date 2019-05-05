import { IDictionary, IPeriod } from 'definitions'

export interface IYears extends IDictionary<number> {
  year: number
}

export interface IMonths extends IYears {
  month: number
}

export interface IDays extends IMonths {
  day: number
}

export interface IHours extends IDays {
  hour: number
}

export interface IMinutes extends IHours {
  minute: number
}

export type TDateTimePeriod = IPeriod<number>

export interface IPeriods extends IDictionary<TDateTimePeriod> {
  dateTime: TDateTimePeriod
  time: TDateTimePeriod
}

export type TDateTime = IMinutes & IPeriods

