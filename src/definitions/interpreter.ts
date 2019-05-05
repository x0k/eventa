import { TValue, IDictionary, IRange } from 'definitions'

export type TDateTimeRange = IRange<number>

export type TExtValue = TValue | TDateTimeRange

export type TOperation = (...args: TExtValue[]) => TExtValue

export type TOperations = IDictionary<TOperation>