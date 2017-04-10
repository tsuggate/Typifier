import {Identifier, Literal, Program, VariableDeclaration, VariableDeclarator} from 'estree';
import {generate} from './output';


export function programToJs(program: Program): string {
   if (program.sourceType === 'script') {
      return program.body.map(node => generate(node)).join('');
   }
   else {
      return 'Not Implemented! (programToJs)';
   }
}

export function identifierToJs(i: Identifier): string {
   return i.name;
}

export function literalToJs(l: Literal): string {
   return l.raw;
}
