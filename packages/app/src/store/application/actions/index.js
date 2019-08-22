import { createAction } from '../../../utils/store'

import { DRAWER, SCHEDULE } from '../constants'

export { default as open } from './open'

export { default as openSchedule } from './openSchedule'

export const setDrawer = createAction(DRAWER)

export const selectSchedule = createAction(SCHEDULE)
