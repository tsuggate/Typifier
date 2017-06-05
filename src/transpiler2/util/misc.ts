import {walk} from 'estree-walker';
import {Node} from 'estree';


export function traverse(program: Node, handler: (node: Node, parent: Node, context: any) => void) {
   walk(program, {
      enter(node: Node, parent: Node) {
         if (node.type) {
            handler(node, parent, this);
         }
      }
   });
}
