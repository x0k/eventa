import { isStaticPartition, getPartitionSize, getPartitionStart } from '../../utils/grouper'

function groupBy (partition, list) {
  if (!list.length) {
    return []
  }
  const groups = []
  const isStatic = isStaticPartition(partition)
  const staticLength = isStatic ? getPartitionSize(partition) : 0
  const getLength = isStatic ? () => staticLength : (start) => getPartitionSize(partition, start)
  let i = 0
  while (i < list.length) {
    let { period } = list[i]
    const start = getPartitionStart(partition, period.start)
    const items = []
    const group = { start, length: getLength(start), items }
    while (i < list.length && period.start >= group.start && period.start < group.start + group.length) {
      items.push(list[i])
      period = list[i++].period
    }
    if (items.length) {
      groups.push(group)
    }
  }
  return groups
}

self.onmessage = function ({ data: { partition, events } }) {
  const grouped = groupBy(partition, events)
  self.postMessage(grouped)
}
