import * as esprima from 'esprima';
import * as path from 'path';
import {readFile} from './util/file-reader';
import {Node, Program} from 'estree';

import * as escodegen from 'escodegen';



/*

{
   "type": "Program",
   "body": [{
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "n"
            },
            "init": {
               "type": "Literal",
               "value": 42,
               "raw": "42"
            }
         }
      ],
      "kind": "var"
   }],
   "sourceType": "script"
}

*/


function fromFile() {
   const jsPath = path.resolve('test-files', 'simple.js');
   const jsPath2 = path.resolve('..', 'client', 'src', 'instance', 'js', 'plugins', 'image-annotation', 'main.js');

   const code = readFile(jsPath);

   if (code) {
      const res = esprima.parse(code);

      const outCode = escodegen.generate(res);

      console.log(outCode);

      // console.log(JSON.stringify(res, null, 3));
   }
}

function basic() {
   const code = 'define(["jquery"], function($) { });';

   const res: Program = esprima.parse(code);

   // res.body.forEach(n => {
   //    if (n.type === 'VariableDeclaration') {
   //       n.kind = 'const';
   //    }
   // });

   console.log(JSON.stringify(res, null, 3));

   const outCode = escodegen.generate(res);

   console.log(outCode);
   // console.log(removeCalls(code));

   // console.log(JSON.stringify(res, null, 3));
}

fromFile();
// basic();

function isConsoleCall(node: Node): boolean {
   return (node.type === 'CallExpression') &&
      (node.callee.type === 'MemberExpression') &&
      (node.callee.object.type === 'Identifier') &&
      (node.callee.object.name === 'console');
}

function removeCalls(source: string) {
   const entries: any = [];

   const parse = esprima.parse as any;

   parse(source, {}, (node: Node, meta) => {

      if (node.type === 'VariableDeclaration') {
         console.log(JSON.stringify(node, null, 3));
      }

      if (isConsoleCall(node)) {
         entries.push({
            start: meta.start.offset,
            end: meta.end.offset
         });
      }
   });

   entries.sort((a, b) => { return b.end - a.end }).forEach(n => {
      source = source.slice(0, n.start) + source.slice(n.end + 1);
   });

   return source;
}