import { buildWorker } from '../../utils'

import Worker from './group.worker.js'

const worker = buildWorker(Worker)

export default function group (partition, events) {
  return worker({ partition, events })
}
