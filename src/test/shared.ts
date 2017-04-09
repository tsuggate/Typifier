import * as esprima from 'esprima';
import {generate} from '../transpiler2/output/output';
import * as escodegen from 'escodegen';


export function matchOutput(code: string) {
   it(code, () => {
      const program = esprima.parse(code);

      const myOutput = generate(program);
      const esCodegenOutput = escodegen.generate(program);

      expect(myOutput).toEqual(esCodegenOutput);
   });
}