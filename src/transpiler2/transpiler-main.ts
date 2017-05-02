import {generate, OutputLanguage, setLanguage} from './output/output';
import * as jsBeautify from 'js-beautify';
import {jsBeautifyOptions} from '../test/shared';
import * as esprima from 'esprima';


export function transpile(code: string, language: OutputLanguage = 'javascript'): string {
   console.log('transpile to', language);
   setLanguage(language);

   const program = esprima.parse(code, { attachComment: true });

   console.log(program);

   const out = generate(program);
   const myOutput = jsBeautify(out, jsBeautifyOptions);

   setLanguage('javascript');

   return myOutput;
}
