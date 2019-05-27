import { reduceIterable } from 'iterator-wrapper'

import { IConstraints, DATE_PARTS } from 'utils/schedule'
import { IPeriod, IDictionary } from 'utils'

import * as H from 'utils/dateTime'

function calcStepFromConstraints (constraints: IConstraints): number | false {
  // @ts-ignore
  const part = DATE_PARTS.find(part => Boolean(constraints[part]) && Boolean(constraints[part].step))
  // @ts-ignore
  return part && constraints[part].step * H[part]
}

interface IGroupedEvent {
  period: IPeriod<number>
  value: IDictionary<any>
}

export function grouper<T> (iterable: IterableIterator<T>, constraints: IConstraints) {
  const step = calcStepFromConstraints(constraints) || H.minute
  
  function separator (previous: IGroupedEvent, current: IDictionary<any>) {
    return 
  }

}