import {Node, Declaration, FunctionDeclaration, VariableDeclaration, VariableDeclarator} from 'estree';
import {generate} from '../generate';
import {GenOptions} from '../generator-options';
import {getFunctionDeclarationTypes} from './find-types/function-declaration';
import {findParentNode} from '../../symbols/symbols';
import {findAssignmentTo} from './find-types/declaration-kind';
import {CodeRange} from './find-types/shared';
import {ESComment, generateLeadingComments2, generateTrailingComments2} from './comments';


export function variableDeclarationToJs(dec: VariableDeclaration, options: GenOptions): string {
   const declarations = dec.declarations.map(d => generate(d, options)).join(', ');

   const res = `${dec.kind} ${declarations};`;

   return variableDeclarationComments(res, dec, options);
}

export function variableDeclarationToTs(dec: VariableDeclaration, options: GenOptions): string {
   const declarations = dec.declarations.map(d => generate(d, options)).join(', ');
   let kind = 'const';

   const parent = findParentNode(options.getProgram(), dec);

   if (parent) {
      dec.declarations.forEach(d => {
         if (d.id.type === 'Identifier') {
            const res = findAssignmentTo(options.getProgram(), d.id, parent.range as CodeRange);
            if (res) {
               kind = 'let';
            }
         }
      });
   }

   const res = `${kind} ${declarations};`;

   return variableDeclarationComments(res, dec, options);
}

export function variableDeclarationComments(code: string, dec: VariableDeclaration, options: GenOptions) {
   let leadingComments = '';
   let trailingComments = '';

   if (dec.leadingComments) {
      const c = generateLeadingComments2(dec.leadingComments as ESComment[], options);

      if (c) {
         leadingComments = '\n' + c + '\n';
      }
   }
   if (dec.trailingComments) {
      const c = generateTrailingComments2(dec.trailingComments as ESComment[], options);

      if (c) {
         trailingComments = c;
      }
   }

   return leadingComments + code + trailingComments;
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
   if (f.generator) {
      throw 'functionDeclaration.generator not implemented!';
   }
   const params = f.params.map(p => generate(p, options)).join(', ');

   return `function ${generate(f.id, options)}(${params}) ${generate(f.body, options)}`;
}

export function functionDeclarationTs(f: FunctionDeclaration, options: GenOptions): string {
   if (f.generator) {
      throw 'functionDeclaration.generator not implemented!';
   }

   const types = getFunctionDeclarationTypes(f, options);

   if (!types || f.params.length !== types.length) {
      throw new Error(`functionDeclaration types don't match.`);
   }

   const params = f.params.map((p, i) => {
      return generate(p, options) + `: ${types[i]}`;
   }).join(', ');

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