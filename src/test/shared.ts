import * as esprima from 'esprima';
import {generate} from '../transpiler2/output/generate';
import * as escodegen from 'escodegen';
import * as jsBeautify from 'js-beautify';
import {GenOptions} from '../transpiler2/output/generator-options';
import {addLogLn} from '../ui/global-actions';


export const jsBeautifyOptions = {
   indent_size: 3,
   indent_char: ' '
};

// let _options: GenOptions = new GenOptions({});


export function matchOutput(code: string) {
   it(code, () => {
      const program = esprima.parse(code);

      const myOutput = reformatCode(generate(program, new GenOptions({}, code)));
      const esCodegenOutput = escodegen.generate(program);

      expect(myOutput).toEqual(esCodegenOutput);
   });
}

export function logOutput(code: string): void {
   const program = esprima.parse(code);

   console.log(jsBeautify(generate(program, new GenOptions({}, code)), jsBeautifyOptions));
}

export function printTree(code: string): void {
   const program = esprima.parse(code, {sourceType: 'module'});

   console.log(JSON.stringify(program, null, 3));
}

export function reformatCode(code: string): string {
   let program;

   try {
      program = esprima.parse(code);
   }
   catch (e) {
      addLogLn(`Error: Esprima failed to parse code.`);
      addLogLn(e.stack);
      console.log(code);
      return '';
   }

   try {
      return escodegen.generate(program);
   }
   catch (e) {
      addLogLn(`Error: Escodegen failed to generate code.`);
      addLogLn(e.stack);
      return '';
   }
}

export function diffOutput(code: string) {
   const program = esprima.parse(code);
   const out = generate(program, new GenOptions({}, code));

   try {
      const myOutput = reformatCode(out);
      const esCodegenOutput = reformatCode(code);

      console.log(findDifference(esCodegenOutput, myOutput));
   }
   catch (e) {
      console.log('failed to parse output');
      console.log(jsBeautify(out));
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

// export function saveOutput(code: string) {
//    fs.ensureDirSync(path.resolve('.', 'out'));
//
//    const outPath = path.resolve('.', 'out', 'out.js');
//    const program = esprima.parse(code);
//
//    const out = generate(program);
//
//    try {
//       const myOutput = jsBeautify(out, jsBeautifyOptions);
//       fs.writeFileSync(outPath, myOutput);
//    }
//    catch (e) {
//       console.log('failed to parse output');
//       console.log(e);
//       // console.log(jsBeautify(out));
//    }
// }