import { createReducer } from '../../../utils/store'

import { ADD_SCHEDULE, SET_SCHEDULES } from '../constants'

export default createReducer({
  [ADD_SCHEDULE]: (state, { payload }) => state.concat(payload),
  [SET_SCHEDULES]: (state, { payload }) => payload
})
