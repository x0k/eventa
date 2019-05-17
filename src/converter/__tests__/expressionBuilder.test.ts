import { IRule } from 'utils/schedule';

import { IEvent } from '../utils'

import { buildExpression } from '../expressionBuilder'

const rules: IRule[] = [
  {
    id: 'call',
    expression: [
      "@case", ["@in", [{ "start": -2211733817000, "end": -2211728417000 }], 1,
        "@case", ["@in", [{ "start": -2211727817000, "end": -2211722417000 }], 2,
          "@case", ["@in", [{ "start": -2211721817000, "end": -2211716417000 }], 3,
            "@case", ["@in", [{ "start": -2211712817000, "end": -2211707417000 }], 4,
              "@case", ["@in", [{ "start": -2211706817000, "end": -2211701417000 }], 5,
                "@case", ["@in", [{ "start": -2211700817000, "end": -2211695417000 }], 6,
                  "@case", ["@in", [{ "start": -2211694817000, "end": -2211689417000 }], 7,
                    "@case", ["@in", [{ "start": -2211688817000, "end": -2211683417000 }], 8,
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