import { TExpression, TOperations, TOperation } from './types'

function typeError (expected: string, element: any) {
  return new TypeError(`Expected ${expected}, but got ${typeof element}: ${element}`)
}

function toExpression (element: any): TExpression {
  if (!Array.isArray(element)) {
    throw typeError('array', element)
  }
  return element
}

function toOperation (element: any): TOperation {
  if (typeof element === 'function') {
    return element
  }
  throw typeError('function', element)
}

function toType (element: any) {
  return (typeof element === 'string' && element[0]) ||
    (Array.isArray(element) && 'array') ||
    typeof element
}

function getType (element: any) {
  const type = toType(element)
  switch (type) {
    case '$':
      return 'action'
    case '@':
      return 'function'
    case 'array':
    case 'object':
      return type
    default:
      return 'value'
  }
}

function functionReducer (operation: TOperation, data: TExpression) {
  const defaultArgs = toExpression(data[0])
  const operationWrapper = (...args: TExpression) => operation.apply(null, defaultArgs.concat(args))
  return [operationWrapper, ...data.slice(1)]
}

function actionReducer (action: string, data: TExpression) {
  switch (action) {
    case '>>': {
      const [ f, g ] = data.slice(0, 2).map(toOperation)
      const composition = (...data: TExpression) => g(f(...data))
      return [composition, ...data.slice(2)]
    }
    case 'eval': {
      const operation = toOperation(data[0])
      return [operation(), ...data.slice(1)]
    }
    case 'map': {
      const array = toExpression(data[0])
      const operation = toOperation(data[1])
      return [array.map(operation), ...data.slice(2)]
    }
    default:
      throw new Error(`Unknown action: ${action}`)
  }
}

export function buildActionsReducer (actionsPrefix: string, operations: TOperations) {
  let actionsReducer: (expression: TExpression, data: any) => TExpression
  const getElement = (type: string, element: any) => {
    switch (type) {
      case 'action': {
        return element.replace(actionsPrefix, '')
      }
      case 'function': {
        const operation = operations[element]
        if (typeof operation !== 'function') {
          throw new Error(`Cannot find operation: ${element}`)
        }
        return operations[element]
      }
      case 'array':
        return element.reduceRight(actionsReducer, [])
      case 'object':
        return Object.keys(element).reduce((acc: { [name: string]: any }, key: string) => {
          const data = element[key]
          const type = getType(data)
          acc[key] = getElement(type, data)
          return acc
        }, {})
      case 'value':
        return element
    }
  }
  actionsReducer = (expression: TExpression, data: any): TExpression => {
    const type = getType(data)
    const element = getElement(type, data)
    switch (type) {
      case 'action': {
        return actionReducer(element, expression)
      }
      case 'function': {
        return functionReducer(element, expression)
      }
      default:
        return [element, ...expression]
    }
  }
  return actionsReducer
}
