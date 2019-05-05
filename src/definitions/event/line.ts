import { IPeriod, TValues } from 'definitions'

export interface ILineEvent extends IPeriod {
  value: TValues;
}

export interface IEventGroup extends IPeriod {
  items: ILineEvent[];
}