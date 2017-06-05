import {generate} from "./output/generate";
import * as jsBeautify from "js-beautify";
import {jsBeautifyOptions, reformatCode} from "../test/shared";
import * as esprima from "esprima";
import {getJavaScriptFile} from "../ui/state/state";
import {Program} from "estree";
import * as escodegen from "escodegen";
import {GeneratorOptions, GenOptions} from "./output/generator-options";
import * as _ from 'underscore';
import {addLogLn, addLog} from '../ui/global-actions';


export function transpile(code: string, generatorOptions?: GeneratorOptions): string | null {
   // const t1 = _.now();
   const options = new GenOptions(generatorOptions || {}, code);

   try {
      const t2 = _.now();
      addLogLn(`Parsing ${getJavaScriptFile()}... `);
      const program = esprima.parse(code, { attachComment: true, loc: true, range: true });
      addLog(`Done - ${_.now() - t2}ms`);

      const t3 = _.now();
      addLogLn(`Checking code gen matches escodegen... `);
      if (!jsGeneratorProducesCorrectOutput(program)) {
         addLogLn(`JS code generation didn't match`);

         return null;
      }
      addLog(`OK - ${_.now() - t3}ms`);

      const t4 = _.now();
      addLogLn(`Generating ${options.getLanguage()}... `);
      const out = generate(program, options);
      addLog(`Success - ${_.now() - t4}ms`);

      const myOutput = jsBeautify(out, jsBeautifyOptions);

      // addLogLn(`Total Time: ${_.now() - t1}ms`);
      return myOutput;
   }
   catch (e) {
      console.log(e);
      addLogLn(e.stack);

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