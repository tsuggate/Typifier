import * as esprima from 'esprima';
import * as fs from 'fs';
import * as escodegen from 'escodegen';
import {Program, Node} from 'estree';

import {isDefine} from './mods/imports';
import {walk} from 'estree-walker';


export function parseAndLog(filePath: string): void {
   try {
      const code = fs.readFileSync(filePath).toString();

      if (code) {
         const program: Program = esprima.parse(code);

         applyMods(program);

         const outCode = escodegen.generate(program);

         console.log(outCode);
      }
   }
   catch (e) {
      console.log(e);
   }
}

// Mutate program :(
function applyMods(program: Program): void {
   traverse(program, (node) => {
      if (node.type === 'ExpressionStatement' && isDefine(node)) {

      }

      // if (node.type === 'VariableDeclaration') {
      //    node.kind = 'const';
      // }
   });
}

export type NodeCallback = (node: Node, state: any) => void;

export function traverse(program: Program, enter: NodeCallback, leave?: NodeCallback) {
   walk(program, {
      enter: enter,
      leave: leave
   });
}
