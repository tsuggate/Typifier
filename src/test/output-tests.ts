import * as esprima from 'esprima';
import {Program} from 'estree';
import * as escodegen from 'escodegen';
import {generate} from '../transpiler2/output/output';


describe('output tests', () => {

   it('output matches expected', () => {
      const code = '// lol \n var a = 5';


      let program: Program = esprima.parse(code, {
         // range: true, tokens: true, comment: true
      });

      console.log(JSON.stringify(program, null, 3));

      // program = escodegen.attachComments(program, program['comments'], program['tokens']);

      const outCode = escodegen.generate(program, {
         // comment: true
      });

      const outCode2 = generate(program);

      console.log('mine: \n', outCode2);

      console.log('expected: \n', outCode);

   });

});


