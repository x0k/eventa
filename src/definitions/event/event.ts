import { TValues } from 'definitions'

export class Event {

  public value: TValues;
  public points: number[];

  public constructor (time: number, value: TValues) {
    this.value = value;
    this.points = [ time ];
  }

  public addPoint (time: number) {
    this.points.push(time);
  }

}