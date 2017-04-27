import {ArrayExpression, CallExpression, ExpressionStatement, FunctionExpression, ReturnStatement} from 'estree';
import {generate} from '../output/output';


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
   console.log(exportNames);

   const body = func.body.body.map(e => {
      console.log(e);
      return generate(e);
   }).join('\n');



   return `${imports.join('\n')} ${body}`;
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

function makeImports(libraryNames: string[], importNames: string[]) {
   return importNames.map((n, i) => {
      return `const ${n} = require('${libraryNames[i]}');`;
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