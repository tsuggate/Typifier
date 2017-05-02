import {
   ArrayExpression, CallExpression, Declaration, ExpressionStatement, FunctionExpression,
   ReturnStatement
} from 'estree';
import {generate} from '../output/output';
import {getNamesFromDeclaration, isDeclaration} from '../output/generators/declaration';
import * as _ from 'underscore';


export function isDefine(es: ExpressionStatement): boolean {
   const e = es.expression;

   if (e.type === 'CallExpression' && e.callee.type === 'Identifier') {
      return e.callee.name === 'define';
   }

   return false;
}

export function generateImports(es: ExpressionStatement): string {
   const e = es.expression as CallExpression;
   const func = e.arguments[1] as FunctionExpression;

   const libraryNames = getLibraryNames(e);
   const importNames = getImportNames(func);
   const imports = makeImports(libraryNames, importNames);

   const exportNames = getExportNames(func);

   checkDeclarationsExist(func, exportNames);

   const body = func.body.body.map(e => {
      if (isDeclaration(e)) {
         return generateDeclaration(e as Declaration, exportNames);
      }
      else if (e.type === 'ReturnStatement') {
         return '';
      }
      else {
         return generate(e);
      }
   }).join('\n');

   return `${imports.join('')} ${body}`;
}

function getLibraryNames(e: CallExpression): string[] {
   const namesArrayExpression = e.arguments[0] as ArrayExpression;

   return namesArrayExpression.elements.map(n => {
      return generate(n).replace(/['"]+/g, '');
   });
}

function getImportNames(e: FunctionExpression): string[] {
   return e.params.map(p => {
      return generate(p);
   })
}

function makeImports(libraryNames: string[], importNames: string[]): string[] {
   return importNames.map((n, i) => {
      return `const ${n} = require('${libraryNames[i]}');\n`;
   });
}

function getExportNames(func: FunctionExpression): string[] {
   const returnStatement = func.body.body.find(e => e.type === 'ReturnStatement') as ReturnStatement | undefined;

   if (returnStatement && returnStatement.argument) {
      const arg = returnStatement.argument;

      if (arg.type === 'ObjectExpression') {
         return arg.properties.map(p => generate(p.key));
      }
      else if (arg.type === 'Identifier') {
         return [ generate(arg) ];
      }
   }
   throw new Error('getExportNames failed');
}

function generateDeclaration(d: Declaration, exportNames: string[]): string {
   const names = getNamesFromDeclaration(d);

   if (_.every(names, n => _.contains(exportNames, n))) {
      return `export ${generate(d)}`;
   }
   return generate(d);
}

function checkDeclarationsExist(func: FunctionExpression, exportNames: string[]): void {
   const decs: string[] = _.flatten(
      func.body.body
         .filter(e => e.type.includes('Declaration'))
         .map(getNamesFromDeclaration)
   );

   exportNames.forEach(n => {
      if (!_.contains(decs, n)) {
         throw new Error(`checkDeclarationsExist: Couldn't find ${n} in module declarations.`);
      }
   });
}
