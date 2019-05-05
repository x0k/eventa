import { TPartition } from 'definitions/event/partition'
import { IEventGroup, ILineEvent } from 'definitions/event/line'

import {
  isStaticPartition,
  getPartitionSize,
  getPartitionStart,
} from './partition'

export async function groupBy (partition: TPartition, list: ILineEvent[]): Promise<IEventGroup[]> {
  if (!list.length) {
    return []
  }
  const groups: IEventGroup[] = []
  const staticPartition = isStaticPartition(partition)
  const staticLength = staticPartition ? getPartitionSize(partition) : 0
  const getLength = staticPartition
    ? () => staticLength
    : (start: number) => getPartitionSize(partition, new Date(start))
  let i = 0
  while (i < list.length) {
    let item = list[i]
    const start = getPartitionStart(partition, item.start)
    const group: IEventGroup = { start, length: getLength(start), items: [] }
    while (i < list.length && item.start >= group.start && item.start < group.start + group.length) {
      group.items.push(item)
      item = list[++i]
    }
    if (group.items.length) {
      groups.push(group)
    }
  }
  return groups
}