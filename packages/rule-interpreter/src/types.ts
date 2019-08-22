export interface IDictionary<T> {
  [key: string]: T
}

export type TExpression = any[]

export type TOperation = (...args: TExpression) => any

export type TOperations = IDictionary<TOperation>

export type TAction = (operation: TOperation) => (...args: TExpression) => any

export type TActions = IDictionary<TAction>
