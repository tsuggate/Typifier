import {Node, Program} from 'estree';
import {identifierToJs, literalToJs, programToJs, propertyToJs} from './generators';
import {
   arrayExpression, assignmentExpression,
   binaryExpression,
   callExpression,
   expressionStatement,
   functionExpression, memberExpression,
   newExpression, objectExpression, thisExpression
} from './generators/expression';
import {blockStatement, returnStatement} from './generators/statement';
import {functionDeclaration, variableDeclarationToJs, variableDeclaratorToJs} from './generators/declaration';


export function generate(node: Node): string {
   return getGenerateFunction(node)(node);
}

function getGenerateFunction(node: Node): (node: Node) => string {
   switch (node.type) {
      case 'Program':
         return programToJs;
      case 'VariableDeclaration':
         return variableDeclarationToJs;
      case 'VariableDeclarator':
         return variableDeclaratorToJs;
      case 'FunctionDeclaration':
         return functionDeclaration;
      case 'Identifier':
         return identifierToJs;
      case 'Literal':
         return literalToJs;
      case 'BinaryExpression':
         return binaryExpression;
      case 'ExpressionStatement':
         return expressionStatement;
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
      case 'BlockStatement':
         return blockStatement;
      case 'ReturnStatement':
         return returnStatement;
      case 'Property':
         return propertyToJs;
      case 'AssignmentExpression':
         return assignmentExpression;
      default:
         return (node: Node) => node.type + ' not implemented!';
   }
}
