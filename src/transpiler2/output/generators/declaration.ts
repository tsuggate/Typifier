import {Node, Declaration, FunctionDeclaration, VariableDeclaration, VariableDeclarator} from 'estree';
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

export function getVariableDeclarationNames(dec: VariableDeclaration): string[] {
   return dec.declarations.map(d => generate(d.id));
}

export function functionDeclaration(f: FunctionDeclaration): string {
   if (f.generator) {
      throw 'functionDeclaration.generator not implemented!';
   }

   const params = f.params.map(generate).join(', ');

   return `function ${generate(f.id)}(${params}) ${generate(f.body)}`;
}

export function getFunctionDeclarationName(f: FunctionDeclaration): string {
   return generate(f.id);
}

export function getNamesFromDeclaration(d: Declaration): string[] {
   switch (d.type) {
      case 'FunctionDeclaration':
         return [getFunctionDeclarationName(d)];
      case 'VariableDeclaration':
         return getVariableDeclarationNames(d);
      case 'ClassDeclaration':
         throw new Error('getNamesFromDeclaration for ClassDeclaration not implemented.');
   }
}

export function isDeclaration(node: Node): boolean {
   return node.type.includes('Declaration');
}