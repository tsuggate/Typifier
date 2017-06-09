import {
   BlockStatement,
   BreakStatement,
   ForStatement,
   IfStatement,
   ReturnStatement,
   SwitchCase,
   SwitchStatement
} from 'estree';
import {generate} from '../generate';
import {GenOptions} from '../generator-options';


export function blockStatement(s: BlockStatement, options: GenOptions): string {
   return '{' + s.body.map(s => generate(s, options)).join('') + '}';
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


export function switchStatement(s: SwitchStatement, options: GenOptions): string {
   const cases = s.cases.map(c => generate(c, options)).join('\n');

   return `switch (${generate(s.discriminant, options)}) { ${cases} }`;
}

export function switchCase(s: SwitchCase, options): string {
   const consequent = s.consequent.map(c => generate(c, options)).join('\n');

   if (s.test) {
      return `case ${generate(s.test, options)}: \n ${consequent}`;
   }
   else {
      return `default: \n ${consequent}`;
   }
}

export function breakStatement(s: BreakStatement, options: GenOptions): string {
   if (s.label) {
      return `break ${s.label};`;
   }
   else {
      return `break;`;
   }
}