import {generate} from './output/generate';
import * as jsBeautify from 'js-beautify';
import {jsBeautifyOptions, reformatCode} from '../test/shared';
import * as esprima from 'esprima';
import {appendLog, getState} from '../ui/home/state';
import {Program} from 'estree';
import * as escodegen from 'escodegen';
import {GeneratorOptions, GenOptions} from './output/generator-options';


export function transpile(code: string, generatorOptions?: GeneratorOptions): string | null {
   const options = new GenOptions(generatorOptions);

   try {
      appendLog(`Parsing ${getState().javascriptFile}`);
      const program = esprima.parse(code, { attachComment: true, loc: true });
      appendLog(`Completed parsing ${getState().javascriptFile}`);


      appendLog(`Checking code gen matches escodegen...`);
      if (!jsGeneratorProducesCorrectOutput(program)) {
         appendLog(`JS code generation didn't match`);

         return null;
      }
      appendLog('done');

      appendLog(`Generating ${options.getLanguage()}...`);
      const out = generate(program, options);
      appendLog(`Completed code generation`);

      const myOutput = jsBeautify(out, jsBeautifyOptions);


      return myOutput;
   }
   catch (e) {
      console.log(e);
      appendLog(e.toString());
      appendLog(e.stack);

      return null;
   }
}

export function jsGeneratorProducesCorrectOutput(program: Program): boolean {
   const options = new GenOptions({});

   let generatedCode, myOutput;


   try {
      generatedCode = generate(program, options);
   }
   catch (e) {
      appendLog('Generating JavaScript code failed:');
      appendLog(e.stack);
      console.log(e);
   }

   try {
      myOutput = reformatCode(generatedCode);
   }
   catch (e) {
      appendLog('Reformatting generated code failed:');
      appendLog(e.stack);
      console.log(generatedCode);
      console.log(e);
   }

   const esCodegenOutput = escodegen.generate(program);

   const res = myOutput === esCodegenOutput;

   if (!res) {
      console.log(myOutput);
   }

   return res;
}