import {generate, OutputLanguage, setLanguage} from './output/generate';
import * as jsBeautify from 'js-beautify';
import {jsBeautifyOptions} from '../test/shared';
import * as esprima from 'esprima';
import {appendLog, getState} from '../ui/home/state';


export function transpile(code: string, language: OutputLanguage = 'javascript'): string | null {
   setLanguage(language);

   try {
      appendLog(`Parsing ${getState().javascriptFile}`);
      const program = esprima.parse(code, { attachComment: true, loc: true });
      appendLog(`Completed parsing ${getState().javascriptFile}`);

      appendLog(`Generating ${language}...`);
      const out = generate(program);
      appendLog(`Completed code generation`);

      const myOutput = jsBeautify(out, jsBeautifyOptions);

      setLanguage('javascript');

      return myOutput;
   }
   catch (e) {
      console.log(e);
      appendLog(e.toString());
      setLanguage('javascript');
      return null;
   }
}

