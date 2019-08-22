import { hour, minute, week, day, getMonthLength } from 'eventa/build/utils/dateTime'

export const MINUTE = 'minute'
export const HOUR = 'hour'
export const DAY = 'day'
export const WEEK = 'week'
export const MONTH = 'month'
export const YEAR = 'year'

export const PARTITIONS_SIZES = {
  [MINUTE]: minute,
  [HOUR]: hour,
  [DAY]: day,
  [WEEK]: week,
  [MONTH]: date => day * getMonthLength(date.getFullYear(), date.getMonth()),
  [YEAR]: date => {
    const year = date.getFullYear()
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += day * getMonthLength(year, i)
    }
    return sum
  }
}
