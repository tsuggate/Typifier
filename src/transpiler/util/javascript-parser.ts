import * as escodegen from 'escodegen';
import {Program} from 'estree';
import * as esprima from 'esprima';

const acorn = require('acorn');


const useEsprima = true;

export interface ParseOptions {
   includeComments?: boolean;
   locationData?: boolean;
}

export function parseJavaScript(code: string, parseOptions: ParseOptions = {}): Program {
   if (useEsprima) {
      return parseWithEsprima(code, parseOptions);
   }
   else {
      return parseWithAcorn(code, parseOptions);
   }
}

export function printAST(code: string): void {
   const ast = esprima.parse(code, {});
   console.log(JSON.stringify(ast, null, 3));
}

function parseWithAcorn(code: string, parseOptions: ParseOptions): Program {
   const locationData = typeof parseOptions.locationData === 'undefined' ? true : parseOptions.locationData;

   if (parseOptions.includeComments) {
      let comments: any[] = [];
      let tokens: any[] = [];

      const ast = acorn.parse(code, { onComment: comments, onToken: tokens, ranges: locationData, sourceType: 'module' });

      escodegen.attachComments(ast, comments, tokens);

      return ast;
   }
   else {
      return acorn.parse(code, { ranges: locationData, sourceType: 'module' });
   }
}

function parseWithEsprima(code: string, parseOptions: ParseOptions): Program {
   const locationData = typeof parseOptions.locationData === 'undefined' ? true : parseOptions.locationData;

   let options = {
      sourceType: 'module' as 'script' | 'module',
      attachComment: parseOptions.includeComments,
      loc: locationData,
      range: locationData
   };

   return esprima.parse(code, options);
}
