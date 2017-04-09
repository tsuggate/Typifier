import {BinaryExpression, CallExpression, ExpressionStatement} from 'estree';
import {generate} from '../output';



export function binaryExpression(be: BinaryExpression): string {
   return `${generate(be.left)} ${be.operator} ${generate(be.right)}`;
}

export function expressionStatement(e: ExpressionStatement) {
   return `${generate(e.expression)};`;
}


export function callExpression(e: CallExpression) {
   return 'TODO';
}