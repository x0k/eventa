import { expressionBuilder } from '../expressionBuilder'
import { IDictionary, TOption, TValue } from 'utils'
import { IRule, IEvent, IEventOptions, IEventPeriods } from 'utils/schedule';

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
    data: {
      subject: "Программная инженерия и информационный менеджмент",
      type: "лаб.",
      teacher: "Майнина К.А.",
      room: "504/1"
    },
    includes: {
      day: [1, 3],
      call: [6, 7]
    }
  },
]

const keys= rules.map(({ id }) => id)
const build = expressionBuilder(keys)

test('Expression builder', () => {
  const expression = build(events[0])
  expect(expression).toEqual([
    '@and', [
      '$>>', '@get', [ 'day' ], '@includes', [ [1, 3] ],
      '$>>', '@get', [ 'call' ], '@includes', [ [6, 7] ]
    ]
  ])
})