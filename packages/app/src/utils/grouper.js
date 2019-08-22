import {
  DAY,
  HOUR,
  MINUTE,
  MONTH,
  PARTITIONS_SIZES,
  WEEK,
  YEAR
} from '../constants/partitions'

export function getPartitionSize (partition, ms) {
  const size = PARTITIONS_SIZES[partition]
  if (typeof size === 'function') {
    const date = new Date(ms)
    return size(date)
  }
  return size
}

function getStartDate (partition, start) {
  const date = new Date(start)
  switch (partition) {
    case YEAR:
      date.setMonth(0, 0)
      date.setHours(0, 0, 0, 0)
      return date
    case MONTH:
      date.setDate(0)
      date.setHours(0, 0, 0, 0)
      return date
    case WEEK: {
      const day = date.getDay() === 0 ? 6 : date.getDay() - 1
      const dt = date.getDate()
      date.setDate(dt - day)
      date.setHours(0, 0, 0, 0)
      return date
    }
    case DAY:
      date.setHours(0, 0, 0, 0)
      return date
    case HOUR:
      date.setMinutes(0, 0, 0)
      return date
    default:
      throw new Error(`Unknown start for partition: ${partition}`)
  }
}

export function getPartitionStart (partition, start) {
  return getStartDate(partition, start).getTime()
}

export function isStaticPartition (partition) {
  switch (partition) {
    case MINUTE:
    case HOUR:
    case DAY:
    case WEEK:
      return true
    default:
      return false
  }
}

function toLocale (date, locale, options) {
  return date.toLocaleString(locale, options)
}

function getHeaderPartitionOptions (partition) {
  switch (partition) {
    case YEAR:
      return { year: 'numeric' }
    case MONTH:
      return { month: 'long', year: 'numeric' }
    case WEEK:
      return { month: 'short', year: 'numeric', day: 'numeric' }
    case DAY:
      return { month: 'numeric', year: 'numeric', day: 'numeric', weekday: 'long' }
    case HOUR:
      return { month: 'numeric', year: 'numeric', day: 'numeric', weekday: 'short', hour: 'numeric' }
    default:
      throw new Error(`Unexpected partition name: ${partition}`)
  }
}

export function headerPartitionToString (partition, date, locale = 'ru-RU') {
  const options = getHeaderPartitionOptions(partition)
  return toLocale(date, locale, options)
}

function getItemPartitionOptions (partition) {
  switch (partition) {
    case YEAR:
      return { month: 'numeric', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric' }
    case MONTH:
    case WEEK:
      return { day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' }
    case DAY:
      return { hour: 'numeric', minute: 'numeric' }
    case HOUR:
      return { minute: 'numeric' }
    default:
      throw new Error(`Unexpected partition name: ${partition}`)
  }
}

export function itemPartitionToString (partition, date, locale = 'ru-RU') {
  const options = getItemPartitionOptions(partition)
  return toLocale(date, locale, options)
}

export function toZeroBased (val) {
  return String(val < 10 ? '0' + val : val)
}

export function partitionToString (partition, date, type = 'item', locale) {
  const pts = type === 'item' ? itemPartitionToString : headerPartitionToString
  return pts(partition, date, locale)
}

export function periodToString (partition, period, type = 'item', locale) {
  const pts = (date) => partitionToString(partition, date, type, locale)
  const from = new Date(period.start)
  const fromString = pts(from)
  if (period.start === period.end) {
    return fromString
  }
  const to = new Date(period.end)
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
