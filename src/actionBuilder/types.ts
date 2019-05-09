export interface IOperations {
  [name: string]: (...args: any[]) => any
}