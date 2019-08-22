import { convert } from '../converter'

import schedule from '../data/schedule.json'

import sample from '../data/calculableSchedule.json'

test('Convert schedule', () => {
  const data = convert(schedule)
  expect(data).toEqual(sample)
})