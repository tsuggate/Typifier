import * as esprima from 'esprima';
import {Program} from 'estree';
import * as escodegen from 'escodegen';


describe('output tests', () => {

   it('output matches expected', () => {
      const code = 'var a = 5;';


      const program: Program = esprima.parse(code);

      const outCode = escodegen.generate(program);

      console.log(outCode);

   });

});


