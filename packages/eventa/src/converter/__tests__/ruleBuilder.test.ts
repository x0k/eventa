import { IEvent } from '../utils'

import { buildExpression } from '../buildExpression'

import { ruleBuilder } from '../ruleBuilder'

const events: IEvent[] = [
  {
    "data": {
      "subject": "Программная инженерия и информационный менеджмент",
      "type": "лек.",
      "teacher": "Майнина К.А.",
      "room": "251/1"
    },
    "options": {
      "includes": {
        "day": 5
      }
    },
    "rules": {
      "includes": {
        "call": [6, 7]
      }
    }
  },
  {
    "data": {
      "subject": "Специальная лаборатория дипломного проектирования",
      "type": "пр.",
      "teacher": "Бабенко В.В.",
      "room": "251/1"
    },
    "options": {
      "includes": {
        "day": 5
      }
    },
    "rules": {
      "includes": {
        "call": [1, 2]
      }
    }
  },
]

const buildRule = ruleBuilder(events, buildExpression)

test('Build one case rule', () => {
  const rule = buildRule('room')
  expect(rule).toEqual({
    id: 'room',
    expression: [
      '@case', [
        '@or', [
          '@and', [
            '$>>', '@get', [ 'day' ], '@equal', [ 5 ],
            '$>>', '@get', [ 'call' ], '@includes', [ [6, 7] ]
          ],
          '@and', [
            '$>>', '@get', [ 'day' ], '@equal', [ 5 ],
            '$>>', '@get', [ 'call' ], '@includes', [ [1, 2] ] ] ],
        '251/1',
        '@default', [ false ] ],
      
    ],
    require: [ 'call' ]
  })
})

test('Build two case rule', () => {
  const rule = buildRule('teacher')
  expect(rule).toEqual({
    id: 'teacher',
    expression: [
      "@case", [
        "@and", [
          "$>>", "@get", [ "day" ], "@equal", [ 5 ],
          "$>>", "@get", [ "call" ], "@includes", [ [ 6, 7 ] ],
        ],
        "Майнина К.А.",
        "@case", [
          "@and", [
            "$>>", "@get", [ "day" ], "@equal", [ 5 ],
            "$>>", "@get", [ "call" ], "@includes", [ [ 1, 2 ] ],
          ],
          "Бабенко В.В.",
          "@default", [ false ] ] ]
    ],
    require: [ 'call' ]
  })
})