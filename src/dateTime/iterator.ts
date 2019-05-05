import { wrap, restrict } from 'iterator-wrapper'

import {
  IYears,
  IMonths,
  IDays,
  IHours,
  IMinutes
} from 'definitions/dateTime'

import {
  years,
  months,
  days,
  hours,
  minutes,
  isNumber
} from './dateParts'

function toMinutes(date: Date): IMinutes {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  }
}

export function buildIterator (begin: Date, end: Date) {
  const condition = (date: IMinutes | number) => !isNumber(date) && (
    date.year < end.getFullYear() ||
    date.month < end.getMonth() ||
    date.day < end.getDate() ||
    date.hour < end.getHours() ||
    date.minute <= end.getMinutes()
  )
  const from = toMinutes(begin)

  return restrict<IMinutes | number>(
    wrap<IHours | number, number, IMinutes>(
      wrap<IDays | number, number, IHours>(
        wrap<IMonths | number, number, IDays>(
          wrap<IYears, number, IMonths>(
            years(from.year),
            months,
            from.month
          ),
          days,
          from.day
        ),
        hours,
        from.hour
      ),
      minutes,
      from.minute
    ),
    condition
  )
}