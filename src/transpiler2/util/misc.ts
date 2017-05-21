import {walk} from 'estree-walker';
import {Node, Program} from 'estree';


export function traverse(program: Program, handler: (node: Node) => void) {
   walk(program, {
      enter(node: Node) {
         if (node.type) {
            handler(node);
         }
      }
   });
}
