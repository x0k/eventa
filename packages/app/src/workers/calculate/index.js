import { buildWorker } from '../../utils'

import Worker from './calc.worker.js'

const worker = buildWorker(Worker)

export default function calculate (schedule) {
  return worker(schedule)
}
