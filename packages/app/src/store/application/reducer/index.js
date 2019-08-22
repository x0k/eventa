import { createReducer } from '../../../utils/store'

import { DRAWER, SCHEDULE } from '../constants'

export default createReducer({
  [DRAWER]: (state, { payload: drawerOpen }) => ({ ...state, drawerOpen }),
  [SCHEDULE]: (state, { payload: schedule }) => ({ ...state, schedule })
})
