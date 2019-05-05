import { IPeriod } from 'definitions'

import { IRule } from '../rule'

export interface ICommonSchedule {
  name: string
  period: IPeriod<number>
  rules: IRule[];
}