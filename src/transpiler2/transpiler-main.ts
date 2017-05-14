import {generate} from "./output/generate";
import * as jsBeautify from "js-beautify";
import {jsBeautifyOptions, reformatCode} from "../test/shared";
import * as esprima from "esprima";
import {addLog, appendLog, getJavaScriptFile} from "../ui/home/state/state";
import {Program} from "estree";
import * as escodegen from "escodegen";
import {GeneratorOptions, GenOptions} from "./output/generator-options";


export function transpile(code: string, generatorOptions?: GeneratorOptions): string | null {
   const options = new GenOptions(generatorOptions);

   try {
      addLog(`Parsing ${getJavaScriptFile()}... `);
      const program = esprima.parse(code, { attachComment: true, loc: true });
      appendLog(`Done`);


      addLog(`Checking code gen matches escodegen... `);
      if (!jsGeneratorProducesCorrectOutput(program)) {
         addLog(`JS code generation didn't match`);

         return null;
      }
      appendLog('OK');

      addLog(`Generating ${options.getLanguage()}... `);
      const out = generate(program, options);
      appendLog(`Success`);

      const myOutput = jsBeautify(out, jsBeautifyOptions);


      return myOutput;
   }
   catch (e) {
      console.log(e);
      // addLog(e.toString());
      addLog(e.stack);

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
      addLog('Generating JavaScript code failed:');
      addLog(e.stack);
      console.log(e);
   }

   try {
      myOutput = reformatCode(generatedCode);
   }
   catch (e) {
      addLog('Reformatting generated code failed:');
      addLog(e.stack);
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