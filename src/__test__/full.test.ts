import {
  convert, ISchedule,
  buildIterator,
  buildGenerator,
  grouper,
  IGroupedEvent,
  IDateTime
} from '../index'

const eventsData = [
  {
    value: {
      minute: 0,
      hour: 1,
      day: 6,
      date: 1,
      month: 0,
      year: 2000,
      milliseconds: 946677600000,
      name: 'event1'
    },
    period: { start: 946677600000, end: 946684740000 }
  },
  {
    value: {
      minute: 0,
      hour: 12,
      day: 6,
      date: 1,
      month: 0,
      year: 2000,
      milliseconds: 946717200000,
      name: 'event1'
    },
    period: { start: 946717200000, end: 946724340000 }
  }
]

test('Should work', () => {
  const start = new Date(2000, 0)
  const end = new Date(2000, 0, 2)
  
  const schedule: ISchedule = {
    name: 'Test',
    period: {
      start: start.getTime(),
      end: end.getTime()
    },
    events: [
      {
        data: { name: 'event1' },
        options: {
          includes: {
            hour: [1, 2, 12, 13]
          }
        }
      }
    ],
    fields: ['name']
  }
  
  const { constraints, rules } = convert(schedule)
  
  const period = buildIterator(start, end, constraints)
  
  function selector<T extends IDateTime> ({ name }: T) {
    return Boolean(name)
  }

  const gen = buildGenerator(rules, period, selector)
  
  function separator<T extends IDateTime> (step: number) {
    return ({ value, period: { end } }: IGroupedEvent<T>, current: T) => {
      if (!value) {
        return true
      }
      return value.name === current.name && (end + step === current.milliseconds)
    }
  }
  
  const events = grouper(gen, constraints, separator)
  
  expect([...events]).toEqual(eventsData)
})