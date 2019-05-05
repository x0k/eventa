
type TNumericPartitionOption = 'numeric' | '2-digit';
type TStringPartitionOption = 'narrow' | 'short' | 'long';

export interface IPartitionOptions {
  month?: TNumericPartitionOption | TStringPartitionOption;
  year?: TNumericPartitionOption;
  day?: TNumericPartitionOption;
  weekday?: TStringPartitionOption;
  hour?: TNumericPartitionOption;
  minute?: TNumericPartitionOption;
}


export type TPartition = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute';

export type TPartitionType = 'item' | 'header';