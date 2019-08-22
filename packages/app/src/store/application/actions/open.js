import { push } from 'connected-react-router'

import { selectSchedule } from '../index'

export default async function * open (path) {
  yield selectSchedule(-1)
  yield push(path)
}
