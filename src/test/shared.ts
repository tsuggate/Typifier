import * as esprima from 'esprima';
import {generate} from '../transpiler2/output/output';
import * as escodegen from 'escodegen';

import * as jsBeautify from 'js-beautify';
import * as diff from 'diff';
import * as path from "path";
import * as fs from 'fs-extra';


const jsBeautifyOptions = {
   indent_size: 4,
   indent_char: ' ',
   jslint_happy: false,
   preserve_newlines: false
};

export function matchOutput(code: string) {
   it(code, () => {
      const program = esprima.parse(code);

      const myOutput = reformatCode(generate(program));
      const esCodegenOutput = escodegen.generate(program);

      expect(myOutput).toEqual(esCodegenOutput);
   });
}

export function logOutput(code: string): void {
   const program = esprima.parse(code);

   console.log(jsBeautify(generate(program), jsBeautifyOptions));
}

export function printTree(code: string): void {
   const program = esprima.parse(code);

   // console.log(program);
   console.log(JSON.stringify(program, null, 3));
}

export function reformatCode(code: string): string {
   const program = esprima.parse(code);

   return escodegen.generate(program);
}

export function diffOutput(code: string) {
   const program = esprima.parse(code);

   // const myOutput = jsBeautify(generate(program), jsBeautifyOptions);
   const out = generate(program);

   try {

      const myOutput = reformatCode(out);

      const esCodegenOutput = reformatCode(code);

      // console.log(diff.diffLines(esCodegenOutput, myOutput));

      console.log(findDifference(esCodegenOutput, myOutput));
   }
   catch (e) {
      console.log('failed to parse output');
      console.log(jsBeautify(out));
   }
   // const esCodegenOutput = jsBeautify(escodegen.generate(program), jsBeautifyOptions);

}

export function findDifference(a: string, b: string) {
   for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {

         // console.log('a.length: ', a.length, ', b.length: ', b.length);
         // console.log(a[i], b[i]);

         return {
            foundDiff: true,
            diff: {
               position: i,
               expected: a.slice(i, i + 100),
               found: b.slice(i, i + 100)
            }
         };
      }
   }
   return {
      foundDiff: false,
      diff: {}
   };
}

export function saveOutput(code: string) {
   fs.ensureDirSync(path.resolve('.', 'out'));

   const outPath = path.resolve('.', 'out', 'out.js');

   const program = esprima.parse(code);

   // const myOutput = jsBeautify(generate(program), jsBeautifyOptions);
   const out = generate(program);

   try {

      const myOutput = reformatCode(out);

      fs.writeFileSync(outPath, myOutput);

   }
   catch (e) {
      console.log('failed to parse output');
      console.log(e);
      // console.log(jsBeautify(out));
   }
}