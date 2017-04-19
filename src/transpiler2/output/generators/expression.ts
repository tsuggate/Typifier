import {
   ArrayExpression, AssignmentExpression, BinaryExpression, CallExpression, ConditionalExpression, ExpressionStatement,
   FunctionExpression,
   LogicalExpression,
   MemberExpression,
   NewExpression, ObjectExpression, ThisExpression, UnaryExpression
} from 'estree';
import {generate} from '../output';


export function binaryExpression(be: BinaryExpression): string {
   return `${generate(be.left)} ${be.operator} ${generate(be.right)}`;
}

export function expressionStatement(e: ExpressionStatement) {
   return `${generate(e.expression)};`;
}

export function callExpression(e: CallExpression) {
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

   return `function(${params}) {${generate(f.body)}}`;
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
   return `${generate(e.left)} ${e.operator} ${generate(e.right)}`;
}

export function conditionalExpression(e: ConditionalExpression): string {
   return `${generate(e.test)} ? ${generate(e.consequent)} : ${generate(e.alternate)}`;
}

export function unaryExpression(e: UnaryExpression): string {
   if (e.prefix) {
      return `${e.operator} ${generate(e.argument)}`
   }
   return `${generate(e.argument)}${e.operator}`;
}