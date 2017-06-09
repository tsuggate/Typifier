import {
   ArrayExpression,
   CallExpression,
   Declaration,
   ExpressionStatement,
   FunctionExpression,
   ReturnStatement
} from "estree";
import {generate} from "../output/generate";
import {getNamesFromDeclaration, isDeclaration} from "../output/generators/declaration";
import * as _ from "underscore";
import {GenOptions} from "../output/generator-options";


const recognisedLibraries = [
   'underscore',
   'jquery',
   'knockout'
];

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

   const body = func.body.body.map(e => {
      if (isDeclaration(e)) {
         return generateDeclaration(e as Declaration, exportNames, options);
      }
      else if (e.type === 'ReturnStatement') {
         if (exportNames.length === 0) {
            return makeDefaultExport(e, options);
         }
         return '';
      }
      else {
         return generate(e, options);
      }
   }).join('');

   const definitions = makeDefinitionsForMissingExports(func, options, importNames);

   return `${imports.join('')} ${body} ${definitions}`;
}

function makeDefaultExport(e: ReturnStatement, options: GenOptions) {
   if (e.argument) {
      return `export default ${generate(e.argument, options)}`;
   }
   return '';
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
   let imports = importNames.map((n, i) => {
      if (_.contains(exportNames, n)) {
         return `export const ${n} = require(${libraryNames[i]});`;
      }
      if (_.contains(recognisedLibraries, libraryNames[i].replace(/['"]+/g, ''))) {
         return `import * as ${n} from ${libraryNames[i]};`;
      }

      return `const ${n} = require(${libraryNames[i]});`;
   });

   const nonBoundImports = getNonBoundImports(libraryNames, importNames);

   imports = imports.concat(nonBoundImports.map((n) => {
      return `import ${n};`;
   }));

   return imports;
}

function getNonBoundImports(libraryNames: string[], importNames: string[]): string[] {
   return _.rest(libraryNames, importNames.length);
}

function getExportNames(func: FunctionExpression, options: GenOptions): string[] {
   const returnStatement = func.body.body.find(e => e.type === 'ReturnStatement') as ReturnStatement | undefined;

   if (returnStatement && returnStatement.argument) {
      const arg = returnStatement.argument;

      if (arg.type === 'ObjectExpression') {
         return arg.properties.map(p => generate(p.key, options));
      }
      else if (arg.type === 'Identifier') {
         return [ generate(arg, options) ];
      }
      else {
         console.log(arg.type, arg);
         // throw new Error('getExportNames failed');
      }
   }
   return [];
}

function generateDeclaration(d: Declaration, exportNames: string[], options: GenOptions): string {
   const names = getNamesFromDeclaration(d, options);

   if (_.every(names, n => _.contains(exportNames, n))) {
      return `export ${generate(d, options)}`;
   }
   return generate(d, options);
}

function makeDefinitionsForMissingExports(func: FunctionExpression, options: GenOptions, importNames: string[]) {
   const decs: string[] = _.flatten(
      func.body.body
         .filter(e => e.type.includes('Declaration'))
         .map(e => getNamesFromDeclaration(e as Declaration, options))
   ).concat(importNames);

   const returnStatement = func.body.body.find(e => e.type === 'ReturnStatement') as ReturnStatement | undefined;

   if (returnStatement && returnStatement.argument) {
      const arg = returnStatement.argument;

      if (arg.type === 'ObjectExpression') {

         const properties = arg.properties.filter(p => {
            const name = generate(p.key, options);

            return !_.contains(decs, name);
         });

         return properties.map(p => `export const ${generate(p.key, options)} = ${generate(p.value, options)};`).join('\n');
      }
      // else {
      //    throw new Error('makeDefinitionsForMissingExports failed');
      // }
   }
   return '';
}
