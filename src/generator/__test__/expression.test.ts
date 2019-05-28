import { expression } from '../expression'

const rules = [
  {
    id: 'call',
    expression: [
      "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208969017000, "end": -2208963617000 }], 1,
        "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208963017000, "end": -2208957617000 }], 2,
          "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208957017000, "end": -2208951617000 }], 3,
            "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208948017000, "end": -2208942617000 }], 4,
              "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208942017000, "end": -2208936617000 }], 5,
                "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208936017000, "end": -2208930617000 }], 6,
                  "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208930017000, "end": -2208924617000 }], 7,
                    "@case", ["$>>", "@dateTime", ["time"], "@in", [{ "start": -2208924017000, "end": -2208918617000 }], 8,
                      "@default", [false] ] ] ] ] ] ] ] ]
    ]
  },
  {
    id:'subject',
    expression: ["@case",["@or",["@or",["@and",["$>>","@get",["day"],"@includes",[[1,3]],"$>>","@get",["call"],"@includes",[[6,7]]],"@and",["$>>","@get",["day"],"@equal",[5],"$>>","@get",["call"],"@includes",[[6,7]]]],"@and",["$>>","@get",["day"],"@equal",[6],"$>>","@get",["call"],"@includes",[[2,6]]]],"Программная инженерия и информационный менеджмент","@case",["@and",["$>>","@get",["day"],"@equal",[5],"$>>","@get",["call"],"@includes",[[1,2]]],"Специальная лаборатория дипломного проектирования","@default",[false]]]],
    require: [ 'call' ]
  },
  {
    id: 'type',
    expression: ["@case",["@and",["$>>","@get",["day"],"@includes",[[1,3]],"$>>","@get",["call"],"@includes",[[6,7]]],"лаб.","@case",["@and",["$>>","@get",["day"],"@equal",[5],"$>>","@get",["call"],"@includes",[[1,2]]],"пр.","@case",["@or",["@and",["$>>","@get",["day"],"@equal",[5],"$>>","@get",["call"],"@includes",[[6,7]]],"@and",["$>>","@get",["day"],"@equal",[6],"$>>","@get",["call"],"@includes",[[2,6]]]],"лек.","@default",[false]]]]],
    require: [ 'call' ]
  },
  {
    id: 'teacher',
    expression: ["@case",["@or",["@or",["@and",["$>>","@get",["day"],"@includes",[[1,3]],"$>>","@get",["call"],"@includes",[[6,7]]],"@and",["$>>","@get",["day"],"@equal",[5],"$>>","@get",["call"],"@includes",[[6,7]]]],"@and",["$>>","@get",["day"],"@equal",[6],"$>>","@get",["call"],"@includes",[[2,6]]]],"Майнина К.А.","@case",["@and",["$>>","@get",["day"],"@equal",[5],"$>>","@get",["call"],"@includes",[[1,2]]],"Бабенко В.В.","@default",[false]]]],
    require: [ 'call' ]
  },
  {
    id: 'room',
    expression: ["@case",["@and",["$>>","@get",["day"],"@includes",[[1,3]],"$>>","@get",["call"],"@includes",[[6,7]]],"504/1","@case",["@and",["$>>","@get",["day"],"@equal",[5],"$>>","@get",["call"],"@includes",[[1,2]]],"516/1","@case",["@and",["$>>","@get",["day"],"@equal",[5],"$>>","@get",["call"],"@includes",[[6,7]]],"251/1","@case",["@and",["$>>","@get",["day"],"@equal",[6],"$>>","@get",["call"],"@includes",[[2,6]]],"412/1","@default",[false]]]]]],
    require: [ 'call' ]
  }
]

test('Simple expression', () => {
  const action = expression(rules)
  const milliseconds = new Date(2019, 4, 6, 18).getTime()
  const state = action({ minute: 0, hour: 18, day: 1, date: 6, month: 4, year: 2019, milliseconds })
  expect(state).toEqual({
    milliseconds,
    minute: 0,
    hour: 18,
    day: 1,
    date: 6,
    month: 4,
    year: 2019,
    call: 6,
    subject: 'Программная инженерия и информационный менеджмент',
    type: 'лаб.',
    teacher: 'Майнина К.А.',
    room: '504/1'
  })
})