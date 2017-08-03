import {matchOutput} from './shared';
import {getTestFileCode} from '../transpiler/util/file-reader';


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
   const code = getTestFileCode('simple');

   if (code) {
      matchOutput(code);
   }
   else {
      throw new Error('simple.js not found');
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

describe('for loops', () => {
   matchOutput('for (var i = 0; i < 5; i++) { var a = i; }');
});

