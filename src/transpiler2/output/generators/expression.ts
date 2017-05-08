import {
   ArrayExpression,
   AssignmentExpression,
   BinaryExpression,
   CallExpression,
   ConditionalExpression,
   ExpressionStatement,
   FunctionExpression,
   LogicalExpression,
   MemberExpression,
   NewExpression,
   ObjectExpression,
   ThisExpression,
   UnaryExpression,
   UpdateExpression
} from 'estree';
import {generate, getLanguage} from '../generate';
import {operatorHasPrecedence} from './operators';


export function binaryExpression(e: BinaryExpression): string {
   let left, right;

   if (e.left.type === 'BinaryExpression' && !operatorHasPrecedence(e.operator, e.left.operator)) {
      left = `(${generate(e.left)})`;
   }
   else {
      left = `${generate(e.left)}`;
   }

   if (e.right.type === 'BinaryExpression' && !operatorHasPrecedence(e.operator, e.right.operator)) {
      right = `(${generate(e.right)})`;
   }
   else {
      right = `${generate(e.right)}`;
   }

   return `${left} ${e.operator} ${right}`;
}

export function expressionStatement(e: ExpressionStatement): string {
   if (getLanguage() === 'typescript' && e['directive'] && e['directive'].includes('use strict')) {
      return '';
   }

   return `${generate(e.expression)};`;
}

export function callExpression(e: CallExpression): string {
   const args = e.arguments.map(generate).join(', ');

   return `${generate(e.callee)}(${args})`;
}

export function newExpression(e: NewExpression): string {
   const args = e.arguments.map(generate).join(', ');

   return `new ${generate(e.callee)}(${args})`;
}

export function arrayExpression(a: ArrayExpression): string {
   return '[' + a.elements.map(generate).join(', ') + ']';
}

export function functionExpression(f: FunctionExpression): string {
   if (f.id !== null) {
      throw 'functionExpression.id !== null';
   }

   const params = f.params.map(generate).join(', ');

   return `function(${params}) ${generate(f.body)}`;
}

export function functionExpressionTs(f: FunctionExpression): string {
   if (f.id !== null) {
      throw 'functionExpression.id !== null';
   }

   const params = f.params.map(p => generate(p) + ': any').join(', ');

   return `function(${params}) ${generate(f.body)}`;
}

export function memberExpression(e: MemberExpression): string {
   if (e.computed) {
      return `${generate(e.object)}[${generate(e.property)}]`;
   }
   return `${generate(e.object)}.${generate(e.property)}`
}

export function objectExpression(e: ObjectExpression): string {
   return '{' + e.properties.map(generate).join(', ') + '}';
}

export function thisExpression(e: ThisExpression): string {
   return 'this';
}

export function assignmentExpression(e: AssignmentExpression): string {
   return `${generate(e.left)} ${e.operator} ${generate(e.right)}`;
}

export function logicalExpression(e: LogicalExpression): string {
   let left, right;

   if (e.operator === '&&') {
      left = e.left.type === 'LogicalExpression' ?
       `(${generate(e.left)})` : generate(e.left);

      right = e.right.type === 'LogicalExpression' ?
       `(${generate(e.right)})` : generate(e.right);
   }
   else {
      left = generate(e.left);

      right = generate(e.right);
   }

   return `${left} ${e.operator} ${right}`;
}

export function conditionalExpression(e: ConditionalExpression): string {
   return `${generate(e.test)} ? ${generate(e.consequent)} : ${generate(e.alternate)}`;
}

export function unaryExpression(e: UnaryExpression): string {
   if (e.prefix) {
      if (e.operator === '!' && e.argument.type === 'LogicalExpression') {
         return `${e.operator}(${generate(e.argument)})`;
      }

      return `${e.operator} ${generate(e.argument)}`
   }
   return `${generate(e.argument)}${e.operator}`;
}

export function updateExpression(e: UpdateExpression): string {
   if (e.prefix) {
      return `${e.operator}${generate(e.argument)}`;
   }
   else {
      return `${generate(e.argument)}${e.operator}`;
   }
}

