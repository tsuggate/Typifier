import {generate} from './output/generate';
import * as jsBeautify from 'js-beautify';
import {jsBeautifyOptions, reformatCode} from '../test/shared';
import * as esprima from 'esprima';
import {getJavaScriptFile} from '../ui/state/state';
import {Program} from 'estree';
import * as escodegen from 'escodegen';
import {GeneratorOptions, GenOptions} from './output/generator-options';
import {addLogLn, logProgress} from '../ui/home/log/logger';


export async function transpile(code: string, generatorOptions?: GeneratorOptions): Promise<string | null> {
   const options = new GenOptions(generatorOptions || {}, code);

   try {
      const program = await logProgress<Program>(
         `Parsing ${getJavaScriptFile()}`,
         () => esprima.parse(code, { attachComment: true, loc: true, range: true }));

      const generationMatches = await logProgress<boolean>(
         `Checking code gen matches escodegen`,
         () => jsGeneratorProducesCorrectOutput(program, code));

      if (!generationMatches) {
         addLogLn(`JS code generation didn't match`);

         return null;
      }

      const out = await logProgress<string>(
         `Generating ${options.getLanguage()}`,
         () => generate(program, options));

      return jsBeautify(out, jsBeautifyOptions);
   }
   catch (e) {
      console.log(e);
      addLogLn(e.stack);

      return null;
   }
}


export function jsGeneratorProducesCorrectOutput(program: Program, code: string): boolean {
   const options = new GenOptions({}, code);

   let generatedCode, myOutput;


   try {
      generatedCode = generate(program, options);
   }
   catch (e) {
      addLogLn('Generating JavaScript code failed:');
      addLogLn(e.stack);
      console.log(e);
   }

   try {
      myOutput = reformatCode(generatedCode);
   }
   catch (e) {
      addLogLn('Reformatting generated code failed:');
      addLogLn(e.stack);
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