import {walk} from 'estree-walker';
import * as esprima from "esprima";
import {CallExpression, FunctionDeclaration, Identifier, Literal, Node, Program} from 'estree';
import {traverse} from '../util/misc';


type Range = [number, number];


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
               const calls = findFunctionCalls(program, node, parent.range as Range);

               calls.forEach(call => {
                  const types = getArgumentTypes(call);
                  console.log(types);
               });

            }
            break;
      }

   });

}

function getArgumentTypes(call: CallExpression) {
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


function findFunctionCalls(program: Program, declaration: FunctionDeclaration, parentRange: Range): CallExpression[] {
   let calls: CallExpression[] = [];

   traverse(program, (node) => {
      switch (node.type) {
         case 'CallExpression':
            const name = (node.callee as Identifier).name;

            if (name === declaration.id.name && insideScope(node.range as Range, parentRange)) {

               calls.push(node);
            }
            break;
      }
   });

   return calls;
}


function findFunctionDeclaration(program: Program, callee: Identifier) {
   traverse(program, (node, parent) => {
      switch (node.type) {
         case 'FunctionDeclaration':
            const functionId = node.id as Identifier;

            if (functionId.name === callee.name && insideScope(callee.range as Range, parent.range as Range)) {
               console.log('Success!');
               console.log('parent type: ', parent.type);
            }

            break;
      }
   });
}


function insideScope(range: Range, scope: Range): boolean {
   return scope[0] <= range[0] && scope[1] >= range[1];
}