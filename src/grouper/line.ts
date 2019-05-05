import {} from 'definitions'
import { IConstraints } from 'definitions/schedule'
import { TPartition } from 'definitions/event/partition'

function calcStepFromConstraints (constraints: IConstraints) {
  const partitions: TPartition[] = ['minute', 'hour', 'day', 'week', 'month', 'year']
  for (const partition of partitions) {
    if (constraints && constraints[partition] !== undefined) {
      const step = constraints[partition].step
      if (step) {
        return getPartitionSize(partition) * step
      }
    }
  }
  return false
}

function calcStepFromEvents (events: Event[]) {
  const sortFn = (a: number, b: number) => b - a
  const getMinDiff = (points: number[]) => {
    if (points.length < 2) {
      throw new Error(`No points to calc diff`)
    }
    points.sort(sortFn)
    let minDiff = points[0] - points[1]
    if (points.length === 2) {
      return minDiff
    }
    for (let i = 2; i < points.length; i++) {
      minDiff = Math.min(minDiff, points[i - 1] - points[i])
    }
    return minDiff
  }
  let diff = Number.MAX_VALUE
  for (const event of events) {
    if (event.points.length > 1) {
      diff = Math.min(diff, getMinDiff(event.points))
    }
  }
  return diff
}

export async function toList ({ events, filter = true, constraints, from, to }: IToListArgs): Promise<ILineEvent[]> {
  if (events.length === 0) {
    return []
  }

  const line: ILineEvent[] = []
  const stepFromConstraints = constraints && calcStepFromConstraints(constraints)
  const step = stepFromConstraints || calcStepFromEvents(events)
  let result: ILineEvent[] = []

  for (const event of events) {
    line.push(...event.points.map((start) => ({
      start,
      value: event.value,
      length: step
    })))
  }
  line.sort((a, b) => a.start - b.start)
  let last = line[0]
  for (let i = 1; i < line.length; i++) {
    const current = line[i]
    if (last.start + last.length === current.start && deepEqual(last.value, current.value)) {
      last.length += current.length
    } else {
      result.push(last)
      last = current
    }
  }
  result.push(last)
  if (from) {
    const time = from.getTime()
    result = result.filter((el) => el.start >= time)
  }
  if (to) {
    const time = to.getTime()
    result = result.filter((el) => el.start <= time)
  }
  if (filter) {
    result = result.filter((el) => Boolean(el.value))
  }
  return result
}