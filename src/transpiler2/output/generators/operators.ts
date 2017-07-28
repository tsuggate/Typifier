import {BinaryOperator, LogicalOperator} from 'estree';

export type Operator = BinaryOperator | LogicalOperator;

export type Precedence = 'less' | 'greater' | 'equal';

export function operatorHasPrecedence(thisOp: BinaryOperator, other: BinaryOperator): boolean {
   return precedence(thisOp, other) === 'greater';
}

export function precedence(thisOp: Operator, other: Operator): Precedence {
   const a = operatorPrecedence(thisOp);
   const b = operatorPrecedence(other);

   if (b < a) {
      return 'less';
   }
   else if (a === b) {
      return 'equal';
   }
   else {
      return 'greater';
   }
}

export function operatorPrecedence(op: Operator): number {
   return binaryOperatorPrecedence(op as BinaryOperator)
      || logicalOperatorPrecedence(op as LogicalOperator);
}

function binaryOperatorPrecedence(op: BinaryOperator): number {
   switch (op) {
      case '**':
         return 15;
      case '*':
      case '/':
      case '%':
         return 14;
      case '+':
      case '-':
         return 13;
      case '<<':
      case '>>':
      case '>>>':
         return 12;
      case '<':
      case '<=':
      case '>':
      case '>=':
      case 'in':
      case 'instanceof':
         return 11;
      case '===':
      case '==':
      case '!==':
      case '!=':
         return 10;
      case '&':
         return 9;
      case '|':
         return 7;
      case '^':
         return 8;
   }
}

function logicalOperatorPrecedence(op: LogicalOperator): number {
   switch (op) {
      case '&&':
         return 6;
      case '||':
         return 5;
   }
}