import { buildIterator, buildGenerator, grouper } from 'eventa'

function build ({ period: { start, end }, constraints, rules }) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const keys = rules.map(({ id }) => id)

  const iterator = buildIterator(startDate, endDate, constraints)

  const gen = buildGenerator(rules, iterator, item => keys.every(key => item[key]))

  const separator = (step) => ({ value, period: { end } }, current) =>
    keys.every(key => value[key] === current[key]) && (end + step === current.milliseconds)

  return grouper(gen, constraints, separator)
}

self.onmessage = function ({ data }) {
  const groups = [...build(data)]
  self.postMessage(groups)
}
