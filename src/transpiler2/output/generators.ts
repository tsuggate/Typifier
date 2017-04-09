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


export function variableDeclarationToJs(dec: VariableDeclaration): string {
   const declarations = dec.declarations.map(variableDeclaratorToJs).join(', ');

   return `${dec.kind} ${declarations};`;
}

export function variableDeclaratorToJs(dec: VariableDeclarator): string {
   const name = generate(dec.id);

   if (dec.init) {
      return `${name} = ${generate(dec.init)}`;
   }

   return `${name}`;
}

export function identifierToJs(i: Identifier): string {
   return i.name;
}

export function literalToJs(l: Literal): string {
   return l.raw;
}
