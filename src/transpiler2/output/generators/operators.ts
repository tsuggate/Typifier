import {BinaryOperator} from 'estree';


export type Precedence = 'less' | 'greater' | 'equal';

export function operatorHasPrecedence(thisOp: BinaryOperator, other: BinaryOperator): boolean {
   return precedence(thisOp, other) === 'greater';
}

export function precedence(thisOp: BinaryOperator, other: BinaryOperator): Precedence {
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

function operatorPrecedence(op: BinaryOperator): number {
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
      case '<':
      case '<=':
      case '>':
      case '>=':
      case 'in':
      case 'instanceof':
         return 11;
      default:
         throw new Error('precedence for operator' + op + ' not implemented!');
   }
}