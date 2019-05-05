import { TOperations, TExtValue, TDateTimeRange } from 'definitions/interpreter'

function isNumber (value: TExtValue): value is number {
  return typeof value === 'number'
}

function isRange (value: TExtValue): value is TDateTimeRange {
  return typeof value === 'object' && 'includes' in value
}

export const operations: TOperations = {
  '=': (a, b) => a === b,
  '!': (operand) => !operand,
  '&': (...list) => {
    if (list.length && list.every(element => Boolean(element))) {
      return list[list.length - 1]
    }
    return false;
  },
  '|': (...list) => list.find(element => Boolean(element)) || false,
  'in': (range, element) => {
    if (!isRange(range)) {
      throw new Error(`Argument "range" has invalid types in "in" operation: ${range}`)
    }
    if (!isNumber(element)) {
      throw new Error(`Argument "element" has invalid types in "in" operation: ${element}`)
    }
    return range.includes(element)
  }
}


