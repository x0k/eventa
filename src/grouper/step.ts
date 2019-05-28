import { IConstraints, DATE_PARTS } from '../utils/schedule'

import * as H from '../utils/dateTime'

export function calcStepFromConstraints (constraints: IConstraints): number | false {
  // @ts-ignore
  const part = DATE_PARTS.find(part => Boolean(constraints[part]) && Boolean(constraints[part].step))
  // @ts-ignore
  return part && constraints[part].step * H[part]
}
