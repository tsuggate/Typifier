import {Node, Program} from 'estree';
import {traverse} from '../util/misc';
import {CodeRange, equalRange} from '../output/generators/find-types/shared';


export function findParentNode(program: Program, target: Node): Node | null {
   let found = false;
   let result: Node | null = null;

   traverse(program, (node: Node, parent: Node, context) => {
      if (found) {
         context.skip();
      }

      if (node.type === target.type && equalRange(node.range as CodeRange, target.range as CodeRange)) {
         found = true;
         result = parent;
      }
   });

   return result;
}
