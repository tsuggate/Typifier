import * as acorn from 'acorn';
import * as escodegen from 'escodegen';
import {Program} from 'estree';
import * as esprima from 'esprima';


const useEsprima = true;

export function parseJavaScript(code: string, includeComments = false): Program {
   if (useEsprima) {
      return parseWithEsprima(code, includeComments);
   }
   else {
      return parseWithAcorn(code, includeComments);
   }
}

function parseWithAcorn(code: string, includeComments: boolean): Program {
   if (includeComments) {
      let comments: any[] = [];
      let tokens: any[] = [];

      const ast = acorn.parse(code, { onComment: comments, onToken: tokens, ranges: true });

      escodegen.attachComments(ast, comments, tokens);

      return ast;
   }
   else {
      return acorn.parse(code, { ranges: true });
   }
}

function parseWithEsprima(code: string, includeComments: boolean): Program {
   if (includeComments) {
      return esprima.parse(code, { attachComment: true, loc: true, range: true });
   }
   else {
      return esprima.parse(code, { loc: true, range: true });
   }
}