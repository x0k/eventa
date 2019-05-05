import { TValues } from 'definitions'
import { Event } from 'definitions/event/event'

export function * createEvents (iterable: IterableIterator<[number, TValues]>) {
  let last: Event | null = null
  for (const [date, value] of iterable) {
    if (last && last.value === value) {
      last.addPoint(date)
    } else {
      last = new Event(date, value)
      yield last
    }
  }
}