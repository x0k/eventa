import { TExpression } from 'definitions'

export interface IRule {
  id: string;
  expression: TExpression;
  require?: string[];
}