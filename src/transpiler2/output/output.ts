import {Node, Program} from 'estree';
import {identifierToJs, literalToJs, programToJs, propertyToJs} from './generators';
import {
   arrayExpression,
   assignmentExpression,
   binaryExpression,
   callExpression,
   conditionalExpression,
   expressionStatement,
   functionExpression,
   logicalExpression,
   memberExpression,
   newExpression,
   objectExpression,
   thisExpression,
   unaryExpression
} from './generators/expression';
import {blockStatement, forStatement, ifStatement, returnStatement} from './generators/statement';
import {functionDeclaration, variableDeclarationToJs, variableDeclaratorToJs} from './generators/declaration';


export function generate(node: Node): string {
   return getGenerateFunction(node)(node);
}

function getGenerateFunction(node: Node): (node: Node) => string {
   switch (node.type) {
      case 'Program':
         return programToJs;
      case 'Property':
         return propertyToJs;
      case 'Identifier':
         return identifierToJs;
      case 'Literal':
         return literalToJs;

      case 'VariableDeclaration':
         return variableDeclarationToJs;
      case 'VariableDeclarator':
         return variableDeclaratorToJs;
      case 'FunctionDeclaration':
         return functionDeclaration;

      case 'BinaryExpression':
         return binaryExpression;
      case 'CallExpression':
         return callExpression;
      case 'NewExpression':
         return newExpression;
      case 'ArrayExpression':
         return arrayExpression;
      case 'FunctionExpression':
         return functionExpression;
      case 'MemberExpression':
         return memberExpression;
      case 'ObjectExpression':
         return objectExpression;
      case 'ThisExpression':
         return thisExpression;
      case 'AssignmentExpression':
         return assignmentExpression;
      case 'LogicalExpression':
         return logicalExpression;
      case 'ConditionalExpression':
         return conditionalExpression;
      case 'UnaryExpression':
         return unaryExpression;

      case 'BlockStatement':
         return blockStatement;
      case 'ReturnStatement':
         return returnStatement;
      case 'ExpressionStatement':
         return expressionStatement;
      case 'IfStatement':
         return ifStatement;
      case 'ForStatement':
         return forStatement;

      default:
         throw new Error(node.type + ' not implemented!');
         // return (node: Node) => node.type + ' not implemented!';
   }
}
