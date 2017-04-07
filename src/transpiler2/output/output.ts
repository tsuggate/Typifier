import {Node, Program} from 'estree';
import {programToJs, variableDeclarationToJs} from './generators';


export function generate(node: Node): string {
   switch (node.type) {
      case 'Program':
         return programToJs(node);
      case 'VariableDeclaration':
         return variableDeclarationToJs(node);
      default:
         return node.type + ' not implemented!';
   }
}