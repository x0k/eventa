import { addSchedule as add } from '../../../api'

import { ADD_SCHEDULE } from '../constants'

export default async function * addSchedule (schedule) {
  await add(schedule)
  yield { type: ADD_SCHEDULE, payload: schedule }
}
