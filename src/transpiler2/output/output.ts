import {Node, Program} from 'estree';
import {identifierToJs, literalToJs, programToJs, variableDeclarationToJs, variableDeclaratorToJs} from './generators';


export function generate(node: Node): string {
   switch (node.type) {
      case 'Program':
         return programToJs(node);
      case 'VariableDeclaration':
         return variableDeclarationToJs(node);
      case 'VariableDeclarator':
         return variableDeclaratorToJs(node);
      case 'Identifier':
         return identifierToJs(node);
      case 'Literal':
         return literalToJs(node);
      default:
         return node.type + ' not implemented!';
   }
}
