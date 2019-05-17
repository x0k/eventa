import { convert } from '../converter'

import schedule from '../../data/schedule.json'

test.skip('Convert schedule', () => {
  console.log(convert(schedule))
})