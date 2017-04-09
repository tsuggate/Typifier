import * as esprima from 'esprima';
import {Program} from 'estree';
import * as escodegen from 'escodegen';
import {generate} from '../transpiler2/output/output';
import {matchOutput} from './shared';

/*
 let program: Program = esprima.parse(code, {
    range: true, tokens: true, comment: true
 });

 program = escodegen.attachComments(program, program['comments'], program['tokens']);

 const outCode = escodegen.generate(program, {
    comment: true
 });
 */


describe('variable declarations', () => {

   matchOutput('var a = 5');
   matchOutput('var a = 5, b = 2, c = 1');


});


