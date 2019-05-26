import { IRule } from 'utils/schedule';

import { IEvent } from '../utils'

import { buildExpression } from '../buildExpression'

const rules: IRule[] = [
  {
    id: 'call',
    expression: [
      "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208969017000, "end": -2208963617000 }], 1,
        "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208963017000, "end": -2208957617000 }], 2,
          "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208957017000, "end": -2208951617000 }], 3,
            "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208948017000, "end": -2208942617000 }], 4,
              "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208942017000, "end": -2208936617000 }], 5,
                "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208936017000, "end": -2208930617000 }], 6,
                  "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208930017000, "end": -2208924617000 }], 7,
                    "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208924017000, "end": -2208918617000 }], 8,
                      "@default", [false] ] ] ] ] ] ] ] ]
    ]
  }
]

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