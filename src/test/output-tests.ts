import {matchOutput} from "./shared";
import {getTestFile} from "../transpiler/util/file-reader";

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

describe('operators', () => {
   matchOutput('var a = n / 2;');
   matchOutput('a + b * c');
   matchOutput('a / (b * c)');
});

describe('call function', () => {
   matchOutput(`define(['jquery'], function($) {});`);
});

describe('simple.js', () => {
   const code = getTestFile('simple');

   if (code) {
      matchOutput(code);
   }
   else {
      throw new Error('simple.js code match failed');
   }

});

describe('conditionals', () => {
   matchOutput('if ((a === 5 && c === 6) || (d !== 3)) { b = 4; } else { }');
   matchOutput('if (a === 5) b = 4; else { b = 2; }');
   matchOutput('if (a === 5) b = 4; else b = 2;');
   matchOutput('if (a === 5) { b = 4; } else if (a == 2) { b = 2; }');
});

describe('boolean expressions', () => {
   matchOutput('((a || b) && c)');
});