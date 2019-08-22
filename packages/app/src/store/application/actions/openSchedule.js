import { push } from 'connected-react-router'

import { selectSchedule } from '../index'

export default async function * openSchedule (index) {
  yield selectSchedule(index)
  yield push('/schedule')
}
