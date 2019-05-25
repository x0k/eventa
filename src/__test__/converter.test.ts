import { convert } from '../converter'

import schedule from '../data/schedule.json'

const sample = {
  name:'РАСПИСАНИЕ ЗАНЯТИЙ на неделю c 06.05.2019 по 12.05.2019 для группы 147а',
  period: { start: 1557090000000, end: 1557608400000 },
  constraints: {},
  rules: [
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
}

test('Convert schedule', () => {
  const data = convert(schedule)
  expect(data).toEqual(sample)
})