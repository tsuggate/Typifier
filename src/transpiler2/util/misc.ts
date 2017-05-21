import {walk} from 'estree-walker';
import {Node, Program} from 'estree';


export function traverse(program: Program, handler: (node: Node, parent: Node) => void) {
   walk(program, {
      enter(node: Node, parent: Node) {
         if (node.type) {
            handler(node, parent);
         }
      }
   });
}
