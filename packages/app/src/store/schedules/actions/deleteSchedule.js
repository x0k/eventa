import { delSchedule as del } from '../../../api'

import { SET_SCHEDULES } from '../constants'

export default async function * delSchedule (schedule) {
  const schedules = await del(schedule)
  yield { type: SET_SCHEDULES, payload: schedules }
}
