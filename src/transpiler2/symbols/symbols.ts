import {walk} from 'estree-walker';
import * as esprima from 'esprima';
import {FunctionDeclaration, Node, Program} from 'estree';
import {traverse} from '../util/misc';
import {CodeRange, equalRange} from '../output/generators/find-types/shared';


export function run(code: string) {

   const program = esprima.parse(code, { range: true });

   traverse(program, (node, parent) => {

      switch (node.type) {
         // case 'CallExpression':
         //    const callee = node.callee as Identifier;
         //    if (callee.name === 'myFunc') {
         //       // findFunctionDeclaration(program, callee);
         //    }
         //    break;

         case 'FunctionDeclaration':
            if (node.id.name === 'myFunc') {


               // const calls = findFunctionCalls(program, node, parent.range as CodeRange);

               // const types = getFunctionTypesFromCalls(calls);

               // console.log(types);

            }
            break;
      }

   });

}

// export function findParentNode2(program: Program, target: Node): Promise<Node | null> {
//    return new Promise<Node | null>(resolve => {
//       traverse(program, (node: Node, parent: Node) => {
//          if (node.type === target.type && equalRange(node.range as CodeRange, target.range as CodeRange)) {
//             resolve(parent);
//          }
//       });
//       resolve(null);
//    });
// }

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
