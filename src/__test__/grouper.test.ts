import { buildIterator, IDateTime } from '../iterator'

import { buildGenerator } from '../generator'

import schedule from '../data/calculableSchedule.json'

import { grouper, IGroupedEvent } from '../grouper'

const expected = [
  {
    value: {
      minute: 20,
      hour: 17,
      day: 1,
      date: 6,
      month: 4,
      year: 2019,
      milliseconds: 1556719200000,
      call: 6,
      subject: 'Программная инженерия и информационный менеджмент',
      type: 'лаб.',
      teacher: 'Майнина К.А.',
      room: '504/1'
    },
    period: { start: 1556719200000, end: 1556722800000 } },
  { value:
  { minute: 40,
    hour: 19,
    day: 1,
    date: 6,
    month: 4,
    year: 2019,
    milliseconds: 1556726400000,
    call: 7,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лаб.',
    teacher: 'Майнина К.А.',
    room: '504/1' },
  period: { start: 1556726400000, end: 1556730000000 } },
  { value:
  { minute: 20,
    hour: 17,
    day: 3,
    date: 8,
    month: 4,
    year: 2019,
    milliseconds: 1556892000000,
    call: 6,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лаб.',
    teacher: 'Майнина К.А.',
    room: '504/1' },
  period: { start: 1556892000000, end: 1556895600000 } },
  { value:
  { minute: 40,
    hour: 19,
    day: 3,
    date: 8,
    month: 4,
    year: 2019,
    milliseconds: 1556899200000,
    call: 7,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лаб.',
    teacher: 'Майнина К.А.',
    room: '504/1' },
  period: { start: 1556899200000, end: 1556902800000 } },
  { value:
  { minute: 20,
    hour: 8,
    day: 5,
    date: 10,
    month: 4,
    year: 2019,
    milliseconds: 1557032400000,
    call: 1,
    subject: 'Специальная лаборатория дипломного проектирования',
    type: 'пр.',
    teacher: 'Бабенко В.В.',
    room: '516/1' },
  period: { start: 1557032400000, end: 1557036000000 } },
  { value:
  { minute: 40,
    hour: 10,
    day: 5,
    date: 10,
    month: 4,
    year: 2019,
    milliseconds: 1557039600000,
    call: 2,
    subject: 'Специальная лаборатория дипломного проектирования',
    type: 'пр.',
    teacher: 'Бабенко В.В.',
    room: '516/1' },
  period: { start: 1557039600000, end: 1557039600000 } },
  { value:
  { minute: 20,
    hour: 17,
    day: 5,
    date: 10,
    month: 4,
    year: 2019,
    milliseconds: 1557064800000,
    call: 6,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лек.',
    teacher: 'Майнина К.А.',
    room: '251/1' },
  period: { start: 1557064800000, end: 1557068400000 } },
  { value:
  { minute: 40,
    hour: 19,
    day: 5,
    date: 10,
    month: 4,
    year: 2019,
    milliseconds: 1557072000000,
    call: 7,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лек.',
    teacher: 'Майнина К.А.',
    room: '251/1' },
  period: { start: 1557072000000, end: 1557075600000 } },
  { value:
  { minute: 40,
    hour: 10,
    day: 6,
    date: 11,
    month: 4,
    year: 2019,
    milliseconds: 1557126000000,
    call: 2,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лек.',
    teacher: 'Майнина К.А.',
    room: '412/1' },
  period: { start: 1557126000000, end: 1557126000000 } },
  { value:
  { minute: 20,
    hour: 17,
    day: 6,
    date: 11,
    month: 4,
    year: 2019,
    milliseconds: 1557151200000,
    call: 6,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лек.',
    teacher: 'Майнина К.А.',
    room: '412/1' },
  period: { start: 1557151200000, end: 1557154800000 } }
]

test('Should group events', () => {
  const { period: { start, end }, rules } = schedule
  const constraints = {
    minute: {
      step: 100
    }
  }

  function separator<T extends IDateTime> (step: number) {
    return ({ value }: IGroupedEvent<T>, current: T) => {
      if (!value) {
        return true
      }
      const { subject, type, teacher, room, call } = value
      return subject === current.subject &&
        type === current.type &&
        call === current.call &&
        teacher === current.teacher &&
        room === current.room
    }
  }

  const iterator = buildIterator(new Date(start), new Date(end), constraints)
  const gen = buildGenerator(rules, iterator, ({ subject }) => Boolean(subject))
  const grouped = grouper(gen, constraints, separator)
  const items = [...grouped]
  
  expect(items).toEqual(expected)
})