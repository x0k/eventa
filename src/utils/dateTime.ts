export function leapYear (year: number) {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
}

export function getMonthLength (year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export const second = 1000

export const minute = 60000

export const hour = 3600000

export const day = 86400000

export const week = 604800000

export function toSeconds (milliseconds: number) {
  return milliseconds / second
}

export function toMinutes (milliseconds: number) {
  return milliseconds / minute
}

export function toHours (milliseconds: number) {
  return milliseconds / hour
}

export function toDays (milliseconds: number) {
  return milliseconds / day
}

export function toWeeks (milliseconds: number) {
  return milliseconds / week
}

export function getTimeBetween (begin: Date, end: Date) {
  return end.getTime() - begin.getTime()
}
