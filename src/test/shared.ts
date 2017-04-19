import * as esprima from 'esprima';
import {generate} from '../transpiler2/output/output';
import * as escodegen from 'escodegen';

import * as jsBeautify from 'js-beautify';
import * as diff from 'diff';

const jsBeautifyOptions = {
   indent_size: 4,
   indent_char: ' ',
   jslint_happy: false,
   preserve_newlines: false
};

export function matchOutput(code: string) {
   it(code, () => {
      const program = esprima.parse(code);

      const myOutput = jsBeautify(generate(program), jsBeautifyOptions);
      const esCodegenOutput = jsBeautify(escodegen.generate(program), jsBeautifyOptions);

      expect(myOutput).toEqual(esCodegenOutput);
   });
}

export function logOutput(code: string): void {
   const program = esprima.parse(code);

   console.log(jsBeautify(generate(program), jsBeautifyOptions));
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

      console.log(diff.diffLines(esCodegenOutput, myOutput));
   }
   catch (e) {
      console.log('failed to parse output');
      console.log(jsBeautify(out));
   }
   // const esCodegenOutput = jsBeautify(escodegen.generate(program), jsBeautifyOptions);



}