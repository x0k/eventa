import { IPeriod, period, typeError } from 'utils'

import { dateTime } from 'utils/dateTime'

import { TDateTimeOption, TDateTimePeriod } from 'utils/schedule'

function transformDateTime (value: TDateTimeOption): Date {
  if (Array.isArray(value)) {
    if (value.length > 1) {
      // @ts-ignore
      return dateTime(value)
    }
    throw typeError('array with length 2-5', value)
  }
  return new Date(value)
}

export function transformPeriod ({ start, end }: TDateTimePeriod): IPeriod<number> {
  const [ startTime, endTime ] = [start, end]
    .map(transformDateTime)
    .map(date => date.getTime())
  return period(startTime, endTime)
}