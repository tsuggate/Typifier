import {FunctionDeclaration, VariableDeclaration, VariableDeclarator} from 'estree';
import {generate} from '../output';


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

export function functionDeclaration(f: FunctionDeclaration) {
   if (f.generator) {
      throw 'functionDeclaration.generator not implemented!';
   }

   const params = f.params.map(generate).join(', ');

   return `function ${generate(f.id)}(${params}) ${generate(f.body)}`;
}
