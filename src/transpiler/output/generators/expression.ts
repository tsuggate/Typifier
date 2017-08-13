import {
   ArrayExpression,
   ArrowFunctionExpression,
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
   SequenceExpression,
   ThisExpression,
   UnaryExpression,
   UpdateExpression,
} from 'estree';
import {generate} from '../generate';
import {operatorHasPrecedence, operatorPrecedence} from './operators';
import {GenOptions} from '../generator-options';
import {containsThisUsage} from './find-types/function-declaration';


export function binaryExpression(e: BinaryExpression, options: GenOptions): string {
   let left, right;

   if (e.left.type === 'BinaryExpression' && operatorPrecedence(e.left.operator) < operatorPrecedence(e.operator)
      || e.left.type === 'ConditionalExpression') {
      left = `(${generate(e.left, options)})`;
   }
   else {
      left = `${generate(e.left, options)}`;
   }

   if (e.right.type === 'BinaryExpression' && operatorPrecedence(e.right.operator) <= operatorPrecedence(e.operator)
      || e.right.type === 'ConditionalExpression') {
      right = `(${generate(e.right, options)})`;
   }
   else {
      right = `${generate(e.right, options)}`;
   }

   return `${left} ${e.operator} ${right}`;
}

export function expressionStatement(e: ExpressionStatement, options: GenOptions): string {
   if (options.getLanguage() === 'typescript' && (e as any)['directive'] && (e as any)['directive'].includes('use strict')) {
      return '';
   }

   return `${generate(e.expression, options)};`;
}

export function callExpression(e: CallExpression, options: GenOptions): string {
   const args = e.arguments.map(a => generate(a, options)).join(', ');

   if (e.callee.type === 'FunctionExpression') {
      return `(${generate(e.callee, options)}(${args}))`;
   }

   return `${generate(e.callee, options)}(${args})`;
}

export function newExpression(e: NewExpression, options: GenOptions): string {
   const args = e.arguments.map(a => generate(a, options)).join(', ');

   return `new ${generate(e.callee, options)}(${args})`;
}

export function arrayExpression(a: ArrayExpression, options: GenOptions): string {
   return '[' + a.elements.map(e => generate(e, options)).join(', ') + ']';
}

export function functionExpression(f: FunctionExpression, options: GenOptions): string {
   const functionId = f.id ? ` ${generate(f.id, options)}` : '';

   const params = f.params.map(p => generate(p, options)).join(', ');

   return `function${functionId}(${params}) ${generate(f.body, options)}`;
}

export function functionExpressionTs(f: FunctionExpression, options: GenOptions): string {
   const functionId = f.id ? ` ${generate(f.id, options)}` : '';

   const paramsArray = f.params.map(p => generate(p, options) + ': any');

   if (containsThisUsage(f.body)) {
      paramsArray.unshift('this: any');
      const params = paramsArray.join(', ');

      return `function${functionId}(${params}) ${generate(f.body, options)}`;
   }
   else {
      const params = paramsArray.join(', ');

      return `(${params}) => ${generate(f.body, options)}`;
   }
}

export function memberExpression(e: MemberExpression, options: GenOptions): string {
   const object = e.object.type === 'UnaryExpression' ?
      `(${generate(e.object, options)})` : generate(e.object, options);

   if (e.computed) {
      return `${object}[${generate(e.property, options)}]`;
   }
   return `${object}.${generate(e.property, options)}`
}

export function objectExpression(e: ObjectExpression, options: GenOptions): string {
   return '{' + e.properties.map(p => generate(p, options)).join(', ') + '}';
}

export function thisExpression(e: ThisExpression): string {
   return 'this';
}

export function assignmentExpression(e: AssignmentExpression, options: GenOptions): string {
   return `${generate(e.left, options)} ${e.operator} ${generate(e.right, options)}`;
}

export function logicalExpression(e: LogicalExpression, options: GenOptions): string {
   let left, right;

   if (e.left.type === 'LogicalExpression' && operatorPrecedence(e.left.operator) < operatorPrecedence(e.operator)) {
      left = `(${generate(e.left, options)})`;
   }
   else {
      left = generate(e.left, options);
   }

   if (e.right.type === 'LogicalExpression' && operatorPrecedence(e.right.operator) <= operatorPrecedence(e.operator)) {
      right = `(${generate(e.right, options)})`;
   }
   else {
      right = generate(e.right, options);
   }

   return `${left} ${e.operator} ${right}`;
}

export function conditionalExpression(e: ConditionalExpression, options: GenOptions): string {
   return `${generate(e.test, options)} ? ${generate(e.consequent, options)} : ${generate(e.alternate, options)}`;
}

export function unaryExpression(e: UnaryExpression, options: GenOptions): string {
   if (e.prefix) {
      if (e.argument.type === 'LogicalExpression' || e.argument.type === 'BinaryExpression') {
         return `${e.operator}(${generate(e.argument, options)})`;
      }

      return `${e.operator} ${generate(e.argument, options)}`
   }
   return `${generate(e.argument, options)}${e.operator}`;
}

export function updateExpression(e: UpdateExpression, options: GenOptions): string {
   if (e.prefix) {
      return `${e.operator}${generate(e.argument, options)}`;
   }
   else {
      return `${generate(e.argument, options)}${e.operator}`;
   }
}

export function arrowFunctionExpression(e: ArrowFunctionExpression, options: GenOptions): string {
   const paramsArray = e.params.map(p => generate(p, options)).join(', ');

   // E.g. wrap in parenthesis if assignment pattern
   const params = e.params.length === 1 && e.params[0].type === 'Identifier' ? paramsArray : `(${paramsArray})`;

   return `${e.async ? 'async ' : ''}${params || '()'} => ${generate(e.body, options)}`;
}

export function arrowFunctionExpressionTs(e: ArrowFunctionExpression, options: GenOptions): string {
   const paramsArray = e.params.map(p => {
      if (p.type === 'AssignmentPattern') {
         return generate(p, options);
      }

      return generate(p, options) + ': any';
   });

   const params = `(${paramsArray.join(', ')})`;

   return `${e.async ? 'async ' : ''}${params} => ${generate(e.body, options)}`;
}

export function sequenceExpression(e: SequenceExpression, options: GenOptions): string {
   return e.expressions.map(exp => generate(exp, options)).join(', ');
}
