import {CallExpression, FunctionDeclaration, Identifier, Literal, Program} from 'estree';
import {CodeRange, insideScope} from './shared';
import {traverse} from '../../../util/misc';
import {findParentNode} from '../../../symbols/symbols';
import {GenOptions} from '../../generator-options';
import * as _ from 'underscore';



export function getFunctionDeclarationTypes(dec: FunctionDeclaration, options: GenOptions): string[] | null {
   const program = options.getProgram();
   const parent = findParentNode(program, dec);

   if (parent) {
      const calls = findFunctionCalls(program, dec, parent.range as CodeRange);
      const types = getFunctionTypesFromCalls(calls);

      console.log(types);
      return types;
   }
   return null;
}

function getFunctionTypesFromCalls(calls: CallExpression[]): string[] {
   return _.zip(...calls.map(getArgumentTypesFromCall)).map(types => {
      if (types.indexOf('any') !== -1) {
         return 'any';
      }
      return types.join(' | ');
   });
}

function getArgumentTypesFromCall(call: CallExpression) {
   let argTypes: string[] = [];

   call.arguments.forEach(a => {
      if (a.type === 'Literal') {
         const t = getTypeOfLiteral(a);

         argTypes.push(t);
      }
      else {
         argTypes.push('any');
      }
   });

   return argTypes;
}

function getTypeOfLiteral(l: Literal) {
   return typeof l.value;
}


function findFunctionCalls(program: Program, declaration: FunctionDeclaration, parentRange: CodeRange): CallExpression[] {
   let calls: CallExpression[] = [];

   traverse(program, (node) => {
      switch (node.type) {
         case 'CallExpression':
            const name = (node.callee as Identifier).name;

            if (name === declaration.id.name && insideScope(node.range as CodeRange, parentRange)) {

               calls.push(node);
            }
            break;
      }
   });

   return calls;
}

// function findFunctionDeclaration(program: Program, callee: Identifier) {
//    traverse(program, (node, parent) => {
//       switch (node.type) {
//          case 'FunctionDeclaration':
//             const functionId = node.id as Identifier;
//
//             if (functionId.name === callee.name && insideScope(callee.range as CodeRange, parent.range as CodeRange)) {
//                console.log('Success!');
//                console.log('parent type: ', parent.type);
//             }
//
//             break;
//       }
//    });
// }