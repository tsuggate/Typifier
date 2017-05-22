import {Identifier, Program} from 'estree';
import {CodeRange, insideScope} from './shared';
import {traverse} from '../../../util/misc';


export function findAssignmentTo(program: Program, id: Identifier, parentRange: CodeRange): boolean {
   let foundAssignment = false;

   traverse(program, (node, parent, context) => {
      if (node.type === 'AssignmentExpression' && insideScope(node.range as CodeRange, parentRange)) {
         if (node.left.type === 'Identifier' && node.left.name === id.name) {
            foundAssignment = true;
            context.skip();
         }
      }
   });

   return foundAssignment;
}