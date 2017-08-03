import {generate} from '../transpiler/output/generate';
import * as escodegen from 'escodegen';
import {GenOptions} from '../transpiler/output/generator-options';
import {addLogLn} from '../renderer/home/log/logger';
import {parseJavaScript} from '../transpiler/util/javascript-parser';
import {prettify} from '../transpiler/util/format-code';


export function matchOutput(code: string): void {
   it(code, () => {
      const program = parseJavaScript(code);

      const myOutput = reformatCode(generate(program, new GenOptions({}, code)), 'matchOutput: myOutput');
      const esCodegenOutput = escodegen.generate(program);

      expect(myOutput).toEqual(esCodegenOutput);
   });
}

export function checkTSOutput(input: string, expectedOutput: string): void {
   it(input, () => {
      const program = parseJavaScript(input);

      const myOutput = generate(program, new GenOptions({language: 'typescript'}, input)).trim();

      expect(myOutput).toEqual(expectedOutput);
   });
}

export function convertToTypescript(code: string): string {
   const program = parseJavaScript(code);
   return generate(program, new GenOptions({language: 'typescript'}, code)).trim();
}

export function matchOutputRaw(code: string): void {
   it(code, () => {
      const program = parseJavaScript(code);

      const myOutput = generate(program, new GenOptions({}, code));
      const esCodegenOutput = escodegen.generate(program);

      expect(myOutput).toEqual(esCodegenOutput);
   });
}

export function reformatCode(code: string, codeName: string): string {
   let program;

   try {
      program = parseJavaScript(code);
   }
   catch (e) {
      addLogLn(`Error: Esprima failed to parse ${codeName}.`);
      addLogLn(e.stack);
      return '';
   }

   try {
      return escodegen.generate(program);
   }
   catch (e) {
      addLogLn(`Error: Escodegen failed to generate ${codeName}.`);
      addLogLn(e.stack);
      return '';
   }
}

export function diffOutput(code: string) {
   const program = parseJavaScript(code);
   const out = generate(program, new GenOptions({}, code));

   try {
      const myOutput = reformatCode(out, 'diffOutput: myOutput');
      const esCodegenOutput = reformatCode(code, 'diffOutput: esCodegenOutput');

      console.log(findDifference(esCodegenOutput, myOutput));
   }
   catch (e) {
      console.log('failed to parse output');
      console.log(prettify(out));
   }
}

export function findDifference(a: string, b: string) {
   for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
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

