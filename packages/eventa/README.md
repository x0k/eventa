# Eventa

## Description

Library for working with schedules:
- Conversion to interpretable schedule format
- Time interval generation
- Calculation of events on the time interval
- Event grouping

## Usage

1. Convert information about events into specific format for interpretation. Then you can save data as JSON file.

```typescript
import { convert, ISchedule } from 'eventa'

const schedule: ISchedule

const data = convert(schedule)
```

2. Create time period.

```typescript
import { buildIterator } from 'eventa'

const begin = new Date()
const end = new Date()
const { constraints } = data

const period = buildIterator(begin, end, constraints)
```

3. Calculate event states for selected time period.

```typescript
import { buildGenerator } from 'eventa'

const { rules } = data

const gen = buildGenerator(rules, period)
```

4. Group calculated states into events.

```typescript
import { grouper, TSeparator } from 'eventa'

const separator: TSeparator

const events = grouper(gen, constraints, separator)
```

## Example

```typescript
import {
  convert, ISchedule,
  buildIterator,
  buildGenerator,
  grouper,
  IGroupedEvent,
  IDateTime
} from 'eventa'

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
  return ({ value, period: { end } }: IGroupedEvent<T>, current: T) =>
    value.name === current.name && (end + step === current.milliseconds)
}

const events = grouper(gen, constraints, separator)

for (const event of events) {
  console.log(event)
  /*
    { value:
        { minute: 0,
          hour: 1,
          day: 6,
          date: 1,
          month: 0,
          year: 2000,
          milliseconds: 946677600000,
          name: 'event1' },
        period: { start: 946677600000, end: 946684740000 } }
    { value:
        { minute: 0,
          hour: 12,
          day: 6,
          date: 1,
          month: 0,
          year: 2000,
          milliseconds: 946717200000,
          name: 'event1' },
        period: { start: 946717200000, end: 946724340000 } }
  */
}
```
