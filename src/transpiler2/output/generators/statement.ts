import {BlockStatement, IfStatement, ReturnStatement} from 'estree';
import {generate} from '../output';


export function blockStatement(s: BlockStatement): string {
   return s.body.map(generate).join('\n');
}

export function returnStatement(s: ReturnStatement): string {
   return `return ${s.argument ? generate(s.argument) : ''};`;
}

export function ifStatement(s: IfStatement): string {
   let conditional = `if (${generate(s.test)}) {${generate(s.consequent)}}`;

   if (s.alternate) {
      if (s.alternate.type === 'BlockStatement') {
         conditional += `else { ${generate(s.alternate)} }`;
      }
      else {
         conditional += `else ${generate(s.alternate)}`;
      }
   }

   return conditional;
}
