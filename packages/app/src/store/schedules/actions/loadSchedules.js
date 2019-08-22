import { loadSchedules as load } from '../../../api'

import { SET_SCHEDULES } from '../constants'

export default async function * loadSchedules () {
  const schedules = await load()
  yield { type: SET_SCHEDULES, payload: schedules }
}
