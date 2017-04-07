import * as esprima from 'esprima';
import {Program} from 'estree';
import * as escodegen from 'escodegen';
import {generate} from '../transpiler2/output/output';


describe('output tests', () => {

   it('output matches expected', () => {
      const code = 'var a = 5;';


      const program: Program = esprima.parse(code);

      console.log(JSON.stringify(program, null, 3));

      const outCode = escodegen.generate(program);

      const outCode2 = generate(program);

      console.log('mine: \n', outCode2);

      console.log('expected: \n', outCode);

   });

});


