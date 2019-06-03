import { buildIterator, IDateTime } from '../iterator'

import { buildGenerator } from '../generator'

import schedule from '../data/calculableSchedule.json'

import { grouper, IGroupedEvent } from '../grouper'

const expected = [ { value:
  { milliseconds: 1557152400000,
    hour: 17,
    date: 6,
    day: 1,
    dateMilliseconds: 1557090000000,
    month: 4,
    monthMilliseconds: 1556658000000,
    year: 2019,
    minute: 20,
    hourMilliseconds: 1557151200000,
    call: 6,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лаб.',
    teacher: 'Майнина К.А.',
    room: '504/1' },
period: { start: 1557152400000, end: 1557154800000 } },
{ value:
  { milliseconds: 1557160800000,
    hour: 19,
    date: 6,
    day: 1,
    dateMilliseconds: 1557090000000,
    month: 4,
    monthMilliseconds: 1556658000000,
    year: 2019,
    minute: 40,
    hourMilliseconds: 1557158400000,
    call: 7,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лаб.',
    teacher: 'Майнина К.А.',
    room: '504/1' },
period: { start: 1557160800000, end: 1557163200000 } },
{ value:
  { milliseconds: 1557325200000,
    hour: 17,
    date: 8,
    day: 3,
    dateMilliseconds: 1557262800000,
    month: 4,
    monthMilliseconds: 1556658000000,
    year: 2019,
    minute: 20,
    hourMilliseconds: 1557324000000,
    call: 6,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лаб.',
    teacher: 'Майнина К.А.',
    room: '504/1' },
period: { start: 1557325200000, end: 1557327600000 } },
{ value:
  { milliseconds: 1557333600000,
    hour: 19,
    date: 8,
    day: 3,
    dateMilliseconds: 1557262800000,
    month: 4,
    monthMilliseconds: 1556658000000,
    year: 2019,
    minute: 40,
    hourMilliseconds: 1557331200000,
    call: 7,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лаб.',
    teacher: 'Майнина К.А.',
    room: '504/1' },
period: { start: 1557333600000, end: 1557336000000 } },
{ value:
  { milliseconds: 1557465600000,
    hour: 8,
    date: 10,
    day: 5,
    dateMilliseconds: 1557435600000,
    month: 4,
    monthMilliseconds: 1556658000000,
    year: 2019,
    minute: 20,
    hourMilliseconds: 1557464400000,
    call: 1,
    subject: 'Специальная лаборатория дипломного проектирования',
    type: 'пр.',
    teacher: 'Бабенко В.В.',
    room: '516/1' },
period: { start: 1557465600000, end: 1557468000000 } },
{ value:
  { milliseconds: 1557474000000,
    hour: 10,
    date: 10,
    day: 5,
    dateMilliseconds: 1557435600000,
    month: 4,
    monthMilliseconds: 1556658000000,
    year: 2019,
    minute: 40,
    hourMilliseconds: 1557471600000,
    call: 2,
    subject: 'Специальная лаборатория дипломного проектирования',
    type: 'пр.',
    teacher: 'Бабенко В.В.',
    room: '516/1' },
period: { start: 1557474000000, end: 1557474000000 } },
{ value:
  { milliseconds: 1557498000000,
    hour: 17,
    date: 10,
    day: 5,
    dateMilliseconds: 1557435600000,
    month: 4,
    monthMilliseconds: 1556658000000,
    year: 2019,
    minute: 20,
    hourMilliseconds: 1557496800000,
    call: 6,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лек.',
    teacher: 'Майнина К.А.',
    room: '251/1' },
period: { start: 1557498000000, end: 1557500400000 } },
{ value:
  { milliseconds: 1557506400000,
    hour: 19,
    date: 10,
    day: 5,
    dateMilliseconds: 1557435600000,
    month: 4,
    monthMilliseconds: 1556658000000,
    year: 2019,
    minute: 40,
    hourMilliseconds: 1557504000000,
    call: 7,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лек.',
    teacher: 'Майнина К.А.',
    room: '251/1' },
period: { start: 1557506400000, end: 1557508800000 } },
{ value:
  { milliseconds: 1557560400000,
    hour: 10,
    date: 11,
    day: 6,
    dateMilliseconds: 1557522000000,
    month: 4,
    monthMilliseconds: 1556658000000,
    year: 2019,
    minute: 40,
    hourMilliseconds: 1557558000000,
    call: 2,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лек.',
    teacher: 'Майнина К.А.',
    room: '412/1' },
period: { start: 1557560400000, end: 1557560400000 } },
{ value:
  { milliseconds: 1557584400000,
    hour: 17,
    date: 11,
    day: 6,
    dateMilliseconds: 1557522000000,
    month: 4,
    monthMilliseconds: 1556658000000,
    year: 2019,
    minute: 20,
    hourMilliseconds: 1557583200000,
    call: 6,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лек.',
    teacher: 'Майнина К.А.',
    room: '412/1' },
period: { start: 1557584400000, end: 1557586800000 } } ]

test('Should group events', () => {
  const { period: { start, end }, rules } = schedule
  const constraints = {
    minute: {
      step: 100
    }
  }

  function separator<T extends IDateTime> (step: number) {
    return ({ value }: IGroupedEvent<T>, current: T) => {
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