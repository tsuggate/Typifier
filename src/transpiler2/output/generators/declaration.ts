import {Node, Declaration, FunctionDeclaration, VariableDeclaration, VariableDeclarator} from 'estree';
import {generate} from '../generate';
import {GenOptions} from '../generator-options';


export function variableDeclarationToJs(dec: VariableDeclaration, options: GenOptions): string {
   const declarations = dec.declarations.map(d => variableDeclaratorToJs(d, options)).join(', ');

   return `${dec.kind} ${declarations};`;
}

export function variableDeclarationToTs(dec: VariableDeclaration, options: GenOptions): string {
   const declarations = dec.declarations.map(d => variableDeclaratorToJs(d, options)).join(', ');

   return `let ${declarations};`;
}

export function variableDeclaratorToJs(dec: VariableDeclarator, options: GenOptions): string {
   const name = generate(dec.id, options);

   if (dec.init) {
      return `${name} = ${generate(dec.init, options)}`;
   }

   return `${name}`;
}

export function getVariableDeclarationNames(dec: VariableDeclaration, options: GenOptions): string[] {
   return dec.declarations.map(d => generate(d.id, options));
}

export function functionDeclaration(f: FunctionDeclaration, options: GenOptions): string {
   // console.log('functionDeclaration');
   if (f.generator) {
      throw 'functionDeclaration.generator not implemented!';
   }
   const params = f.params.map(p => generate(p, options)).join(', ');

   return `function ${generate(f.id, options)}(${params}) ${generate(f.body, options)}`;
}

export function functionDeclarationTs(f: FunctionDeclaration, options: GenOptions): string {
   // console.log('functionDeclarationTs');
   if (f.generator) {
      throw 'functionDeclaration.generator not implemented!';
   }
   const params = f.params.map(p => generate(p, options) + ': any').join(', ');

   return `function ${generate(f.id, options)}(${params}) ${generate(f.body, options)}`;
}

export function getFunctionDeclarationName(f: FunctionDeclaration, options: GenOptions): string {
   return generate(f.id, options);
}

export function getNamesFromDeclaration(d: Declaration, options: GenOptions): string[] {
   switch (d.type) {
      case 'FunctionDeclaration':
         return [getFunctionDeclarationName(d, options)];
      case 'VariableDeclaration':
         return getVariableDeclarationNames(d, options);
      case 'ClassDeclaration':
         throw new Error('getNamesFromDeclaration for ClassDeclaration not implemented.');
   }
}

export function isDeclaration(node: Node): boolean {
   return node.type.includes('Declaration');
}