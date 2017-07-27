import {generate} from './output/generate';
import * as jsBeautify from 'js-beautify';
import {jsBeautifyOptions, reformatCode} from '../test/shared';
import {getJavaScriptFile} from '../ui/state/state';
import {Program} from 'estree';
import * as escodegen from 'escodegen';
import {GeneratorOptions, GenOptions} from './output/generator-options';
import {addLogLn, logProgress} from '../ui/home/log/logger';
import {parseJavaScript} from './util/javascript-parser';


interface JavascriptOutput {
   matches: boolean;
   generated: string;
   escodegen: string;
}

export interface TranspileOutput {
   code: string;
   success: boolean;
   javascriptOutput: JavascriptOutput | null;
}

export async function transpile(code: string, generatorOptions?: GeneratorOptions): Promise<TranspileOutput> {
   try {
      const options = new GenOptions(generatorOptions || {}, code);

      const program = await logProgress<Program>(
         `Parsing ${getJavaScriptFile()}`,
         () => parseJavaScript(code, true));

      const javascriptOutput = await logProgress<JavascriptOutput>(
         `Checking code gen matches escodegen`,
         () => jsGenerators(program, code));

      if (!javascriptOutput.matches) {
         addLogLn(`JS code generation didn't match`);
         console.log(javascriptOutput);

         return {
            code: '',
            success: false,
            javascriptOutput
         }
      }

      const out = await logProgress<string>(
         `Generating ${options.getLanguage()}`,
         () => generate(program, options));

      const outputCode = jsBeautify(out, jsBeautifyOptions);

      return {
         code: outputCode,
         success: true,
         javascriptOutput
      }
   }
   catch (e) {
      console.log(e);
      addLogLn(e.stack);

      return {
         code: '',
         success: false,
         javascriptOutput: null
      };
   }
}

export function jsGenerators(program: Program, code: string): JavascriptOutput {
   console.log(program);
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
      myOutput = reformatCode(generatedCode, 'jsGenerators: generatedCode');
   }
   catch (e) {
      addLogLn('Reformatting generated code failed:');
      addLogLn(e.stack);
      console.log(e);
   }

   const esCodegenOutput = escodegen.generate(program);

   const matches = myOutput === esCodegenOutput;

   if (!matches) {
      return {
         matches: matches,
         generated: myOutput ? myOutput : generatedCode,
         escodegen: esCodegenOutput
      };
   }

   return {
      matches: matches,
      generated: myOutput,
      escodegen: esCodegenOutput
   };
}

