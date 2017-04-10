import {Node, Program} from 'estree';
import {identifierToJs, literalToJs, programToJs} from './generators';
import {
   arrayExpression,
   binaryExpression,
   callExpression,
   expressionStatement,
   functionExpression,
   newExpression
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
      case 'BlockStatement':
         return blockStatement;
      case 'ReturnStatement':
         return returnStatement;
      default:
         return (node: Node) => node.type + ' not implemented!';
   }
}
