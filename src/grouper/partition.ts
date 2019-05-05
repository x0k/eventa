import { IPeriod } from 'definitions'
import { TPartition, IPartitionOptions, TPartitionType } from 'definitions/event/partition'

import { dateTimeUtils } from 'dateTime'

export function getPartitionSize (partition: TPartition, date?: Date) {
  switch (partition) {
    case 'minute':
    case 'hour':
    case 'day':
    case 'week':
      return dateTimeUtils[partition]
    case 'month':
      if (!date) {
        throw new Error('Not defined date for non-static partition: month')
      }
      const len = dateTimeUtils.getMonthLength(date.getFullYear(), date.getMonth())
      return len * dateTimeUtils.day
    case 'year':
      if (!date) {
        throw new Error('Not defined date for non-static partition: month')
      }
      const year = date.getFullYear()
      let sum = 0
      for (let i = 0; i < 12; i++) {
        sum += dateTimeUtils.day * dateTimeUtils.getMonthLength(year, i)
      }
      return sum
    default:
      throw new Error(`Unknown size of partition: ${partition}`)
  }
}

function getDate (partition: TPartition, date: Date) {
  switch (partition) {
    case 'year':
      date.setMonth(0, 0)
      date.setHours(0, 0, 0, 0)
      return date
    case 'month':
      date.setDate(0)
      date.setHours(0, 0, 0, 0)
      return date
    case 'week': {
      const day = date.getDay() === 0 ? 6 : date.getDay() - 1
      const dt = date.getDate()
      date.setDate(dt - day)
      date.setHours(0, 0, 0, 0)
      return date
    }
    case 'day':
      date.setHours(0, 0, 0, 0)
      return date
    case 'hour':
      date.setMinutes(0, 0, 0)
      return date
    default:
      throw new Error(`Unknown start for partition: ${partition}`)
  }
}

export function getPartitionStart (partition: TPartition, begin: number) {
  const date = new Date(begin)
  return getDate(partition, date).getTime()
}

export function isStaticPartition (partition: TPartition) {
  switch (partition) {
    case 'minute':
    case 'hour':
    case 'day':
    case 'week':
      return true
    default:
      return false
  }
}

export function headerPartitionToString (partition: TPartition, date: Date, locale = 'ru-RU') {
  const loc = (options: IPartitionOptions) => date.toLocaleString(locale, options)
  switch (partition) {
    case 'year':
      return loc({ year: 'numeric' })
    case 'month':
      return loc({ month: 'long', year: 'numeric' })
    case 'week':
      return loc({ month: 'short', year: 'numeric', day: 'numeric' })
    case 'day':
      return loc({ month: 'numeric', year: 'numeric', day: 'numeric', weekday: 'long' })
    case 'hour':
      return loc({ month: 'numeric', year: 'numeric', day: 'numeric', weekday: 'short', hour: 'numeric' })
    default:
      throw new Error(`Unexpected partition name: ${partition}`)
  }
}

export function itemPartitionToString (partition: TPartition, date: Date, locale = 'ru-RU') {
  const loc = (options: IPartitionOptions) => date.toLocaleString(locale, options)
  switch (partition) {
    case 'year':
      return loc({ month: 'numeric', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric' })
    case 'month':
    case 'week':
      return loc({ day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' })
    case 'day':
      return loc({ hour: 'numeric', minute: 'numeric' })
    case 'hour':
      return loc({ minute: 'numeric' })
    default:
      throw new Error(`Unexpected partition name: ${partition}`)
  }
}

export function toZeroBased (val: number) {
  return String(val < 10 ? '0' + val : val)
}

export function partitionToString (partition: TPartition, date: Date, type: TPartitionType = 'item', locale?: string) {
  const pts = type === 'item' ? itemPartitionToString : headerPartitionToString
  return pts(partition, date, locale)
}

export function periodToString (partition: TPartition, period: IPeriod, type: TPartitionType = 'item', locale?: string) {
  const pts = (date: Date) => partitionToString(partition, date, type, locale)
  const from = new Date(period.start)
  const fromString = pts(from)
  if (period.length === 0) {
    return fromString
  }
  const to = new Date(period.start + period.length)
  const toString = pts(to)
  let i = 0
  const splitter = /, |[:-]| /
  const fromPartitions = fromString.split(splitter)
  const toPartitions = toString.split(splitter)
  while (i < fromPartitions.length && fromPartitions[i] === toPartitions[i]) {
    i++
  }
  if (i === fromString.length) {
    return fromString
  }
  const toStringBegin = toString.indexOf(toPartitions[i])
  return `${fromString} - ${toString.slice(toStringBegin)}`
}