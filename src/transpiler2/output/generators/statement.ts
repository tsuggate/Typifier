import {BlockStatement, ForStatement, IfStatement, ReturnStatement} from 'estree';
import {generate} from '../output';


export function blockStatement(s: BlockStatement): string {
   return '{' + s.body.map(generate).join('\n') + '}';
}

export function returnStatement(s: ReturnStatement): string {
   return `return ${s.argument ? generate(s.argument) : ''};`;
}

export function ifStatement(s: IfStatement): string {
   let conditional = `if (${generate(s.test)}) ${generate(s.consequent)}`;

   if (s.alternate) {
      conditional += `else ${generate(s.alternate)}`;
   }

   return conditional;
}

export function forStatement(s: ForStatement): string {
   const init = s.init ? generate(s.init) : '';
   const test = s.test ? generate(s.test) : '';
   const update = s.update ? generate(s.update) : '';
   const body = generate(s.body);

   return `for (${s.init && s.init.type === 'VariableDeclaration' ? init : init + ';'} ${test}; ${update}) ${body}`;
}
