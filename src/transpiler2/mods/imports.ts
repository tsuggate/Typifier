import {ExpressionStatement} from 'estree';


export function isDefine(es: ExpressionStatement): boolean {
   const e = es.expression;

   if (e.type === 'CallExpression' && e.callee.type === 'Identifier') {
      return e.callee.name === 'define';
   }

   return false;
}

export function modifyDefine(es: ExpressionStatement) {
   console.log('modifyDefine');

   
}