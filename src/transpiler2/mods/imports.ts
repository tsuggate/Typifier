import {
   ArrayExpression, CallExpression, Declaration, ExpressionStatement, FunctionExpression, Literal, Property,
   ReturnStatement
} from 'estree';
import {generate} from '../output/generate';
import {getNamesFromDeclaration, isDeclaration} from '../output/generators/declaration';
import * as _ from 'underscore';
import {GenOptions} from '../output/generator-options';


export function isDefine(es: ExpressionStatement): boolean {
   const e = es.expression;

   if (e.type === 'CallExpression' && e.callee.type === 'Identifier') {
      return e.callee.name === 'define';
   }

   return false;
}

export function generateImports(es: ExpressionStatement, options: GenOptions): string {
   const e = es.expression as CallExpression;
   const func = e.arguments[1] as FunctionExpression;

   const libraryNames = getLibraryNames(e, options);
   const importNames = getImportNames(func, options);
   const exportNames = getExportNames(func, options);
   const imports = makeImports(libraryNames, importNames, exportNames);

   const literalExports = getLiteralExports(func, options);

   checkDeclarationsExist(func, exportNames, options, importNames);

   const body = func.body.body.map(e => {
      if (isDeclaration(e)) {
         return generateDeclaration(e as Declaration, exportNames, options);
      }
      else if (e.type === 'ReturnStatement') {
         return '';
      }
      else {
         return generate(e, options);
      }
   }).join('\n');

   return `${imports.join('')} ${body} ${literalExports}`;
}

function getLibraryNames(e: CallExpression, options: GenOptions): string[] {
   const namesArrayExpression = e.arguments[0] as ArrayExpression;

   return namesArrayExpression.elements.map(n => {
      return generate(n, options);
   });
}

function getImportNames(e: FunctionExpression, options: GenOptions): string[] {
   return e.params.map(p => {
      return generate(p, options);
   })
}

function makeImports(libraryNames: string[], importNames: string[], exportNames: string[]): string[] {
   return importNames.map((n, i) => {
      if (_.contains(exportNames, n)) {
         return `export const ${n} = require(${libraryNames[i]});\n`;
      }

      return `const ${n} = require(${libraryNames[i]});\n`;
   });
}

function getExportNames(func: FunctionExpression, options: GenOptions): string[] {
   const returnStatement = func.body.body.find(e => e.type === 'ReturnStatement') as ReturnStatement | undefined;

   if (returnStatement && returnStatement.argument) {
      const arg = returnStatement.argument;

      if (arg.type === 'ObjectExpression') {
         return arg.properties.filter(p => p.value.type !== 'Literal').map(p => generate(p.key, options));
      }
      else if (arg.type === 'Identifier') {
         return [ generate(arg, options) ];
      }
      else {
         throw new Error('getExportNames failed');
      }
   }
   return [];
}

function findLiteralExports(func: FunctionExpression): Property[] {
   const returnStatement = func.body.body.find(e => e.type === 'ReturnStatement') as ReturnStatement | undefined;

   if (returnStatement && returnStatement.argument) {
      const arg = returnStatement.argument;

      if (arg.type === 'ObjectExpression') {
         return arg.properties.filter(p => p.value.type === 'Literal');
      }
      else {
         throw new Error('findLiteralExports failed');
      }
   }
   return [];
}

function getLiteralExports(func: FunctionExpression, options: GenOptions): string {
   const properties = findLiteralExports(func);

   if (properties.length > 0) {
      return properties.map(l => `export const ${generate(l.key, options)} = ${generate(l.value, options)};`).join('\n');
   }
   return '';
}

function generateDeclaration(d: Declaration, exportNames: string[], options: GenOptions): string {
   const names = getNamesFromDeclaration(d, options);

   if (_.every(names, n => _.contains(exportNames, n))) {
      return `export ${generate(d, options)}`;
   }
   return generate(d, options);
}

function checkDeclarationsExist(func: FunctionExpression, exportNames: string[], options: GenOptions, importNames: string[]): void {
   const decs: string[] = _.flatten(
      func.body.body
         .filter(e => e.type.includes('Declaration'))
         .map(e => getNamesFromDeclaration(e as Declaration, options))
   ).concat(importNames);

   exportNames.forEach(n => {
      if (!_.contains(decs, n)) {
         throw new Error(`checkDeclarationsExist: Couldn't find "${n}" in module declarations.`);
      }
   });
}
