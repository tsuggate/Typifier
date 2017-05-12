import {BlockStatement, ForStatement, IfStatement, ReturnStatement} from 'estree';
import {generate} from '../generate';
import {GenOptions} from '../generator-options';


export function blockStatement(s: BlockStatement, options: GenOptions): string {
   return '{' + s.body.map(s => generate(s, options)).join('\n') + '\n}';
}

export function returnStatement(s: ReturnStatement, options: GenOptions): string {
   return `return ${s.argument ? generate(s.argument, options) : ''};`;
}

export function ifStatement(s: IfStatement, options: GenOptions): string {
   let conditional = `if (${generate(s.test, options)}) ${generate(s.consequent, options)}`;

   if (s.alternate) {
      conditional += `else ${generate(s.alternate, options)}`;
   }

   return conditional;
}

export function forStatement(s: ForStatement, options: GenOptions): string {
   const init = s.init ? generate(s.init, options) : '';
   const test = s.test ? generate(s.test, options) : '';
   const update = s.update ? generate(s.update, options) : '';
   const body = generate(s.body, options);

   return `for (${s.init && s.init.type === 'VariableDeclaration' ? init : init + ';'} ${test}; ${update}) ${body}`;
}
