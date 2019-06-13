import { IEvent } from '../utils'

import { buildExpression } from '../buildExpression'

const events: IEvent[] = [
  {
    "data": {
      "subject": "Программная инженерия и информационный менеджмент",
      "type": "лаб.",
      "teacher": "Майнина К.А.",
      "room": "504/1"
    },
    "options": {
      "includes": {
        "day": [1, 3]
      }
    },
    "rules": {
      "includes": {
        "call": [6, 7]
      }
    }
  },
]

test('Expression builder', () => {
  const expression = buildExpression(events[0])
  expect(expression).toEqual([
    '@and', [
      '$>>', '@get', [ 'day' ], '@includes', [ [1, 3] ],
      '$>>', '@get', [ 'call' ], '@includes', [ [6, 7] ]
    ]
  ])
})