import {Node, Declaration, FunctionDeclaration, VariableDeclaration, VariableDeclarator} from 'estree';
import {generate} from '../generate';


export function variableDeclarationToJs(dec: VariableDeclaration): string {
   const declarations = dec.declarations.map(variableDeclaratorToJs).join(', ');

   return `${dec.kind} ${declarations};`;
}

export function variableDeclarationToTs(dec: VariableDeclaration): string {
   const declarations = dec.declarations.map(variableDeclaratorToJs).join(', ');

   return `let ${declarations};`;
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
   // console.log('functionDeclaration');
   if (f.generator) {
      throw 'functionDeclaration.generator not implemented!';
   }
   const params = f.params.map(generate).join(', ');

   return `function ${generate(f.id)}(${params}) ${generate(f.body)}`;
}

export function functionDeclarationTs(f: FunctionDeclaration): string {
   // console.log('functionDeclarationTs');
   if (f.generator) {
      throw 'functionDeclaration.generator not implemented!';
   }
   const params = f.params.map(p => generate(p) + ': any').join(', ');

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