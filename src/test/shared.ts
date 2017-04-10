import * as esprima from 'esprima';
import {generate} from '../transpiler2/output/output';
import * as escodegen from 'escodegen';

import * as jsBeautify from 'js-beautify';


export function matchOutput(code: string) {
   it(code, () => {
      const program = esprima.parse(code);

      const myOutput = jsBeautify(generate(program));
      const esCodegenOutput = jsBeautify(escodegen.generate(program));

      expect(myOutput).toEqual(esCodegenOutput);
   });
}

export function logOutput(code: string): void {
   const program = esprima.parse(code);

   console.log(jsBeautify(generate(program)));
}