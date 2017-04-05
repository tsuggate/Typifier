import * as esprima from 'esprima';
import * as fs from 'fs';
import * as escodegen from 'escodegen';
import {Program, Node} from 'estree';

import * as astravel from 'astravel';
import {isDefine} from './mods/imports';



export function parseAndLog(filePath: string): void {
   try {
      const code = fs.readFileSync(filePath).toString();

      if (code) {
         const res: Program = esprima.parse(code);

         traverse(res, (node) => {
            if (node.type === 'ExpressionStatement' && isDefine(node)) {

            }

            if (node.type === 'VariableDeclaration') {
               node.kind = 'const';
            }
         });

         const outCode = escodegen.generate(res);

         console.log(outCode);
      }
   }
   catch (e) {
      console.log(e);
   }
}

// Mutate program :(
function applyMods(program: Program): void {

}

export function traverse(program: Program, callback: (node: Node, state: any) => void): void {
   const traveler = astravel.makeTraveler({
      go: function (node: Node, state: any) {
         // required for some reason
         this.super.go.call(this, node, state);

         callback(node, state);
      }
   });

   traveler.go(program, {});
}