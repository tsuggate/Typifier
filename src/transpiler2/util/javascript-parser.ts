import * as acorn from 'acorn';
import * as escodegen from 'escodegen';
import {Program} from 'estree';
// import * as esprima from 'esprima';


export function parseJavaScript(code: string, includeComments = false): Program {
   return parseWithAcorn(code, includeComments);
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

