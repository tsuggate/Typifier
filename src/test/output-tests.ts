import {diffOutput, logOutput, matchOutput} from './shared';
import {getTestFile, readFile} from '../transpiler/util/file-reader';
import * as path from 'path';

/*
 let program: Program = esprima.parse(code, {
    range: true, tokens: true, comment: true
 });

 program = escodegen.attachComments(program, program['comments'], program['tokens']);

 const outCode = escodegen.generate(program, {
    comment: true
 });
 */


// describe('variable declarations', () => {
//    matchOutput('var a = 5');
//    matchOutput('var a = 5, b = 2, c = 1');
// });
//
// describe('operators', () => {
//    matchOutput('var a = n / 2;');
// });
//
// describe('call function', () => {
//    matchOutput(`define(['jquery'], function($) {});`);
// });
//
describe('simple.js', () => {
   const code = getTestFile('simple');

   if (code) {
      matchOutput(code);
   }

});

// describe('big file', () => {
//    const jsPath = path.resolve('..', '..', 'Downloads', 'client', 'src', 'instance', 'js', 'plugins', 'image-annotation', 'main.js');
//
//    // /Users/tobysuggate/Downloads/client/src/instance/js/plugins/image-annotation/main.js
//
//    const code = readFile(jsPath);
//
//    if (code) {
//       // matchOutput(code);
//       // logOutput(code);
//       diffOutput(code);
//    }
//
// });


describe('conditionals', () => {
   matchOutput('if ((a === 5 && c === 6) || (d !==3)) { b = 4; } else { }');
   matchOutput('if (a === 5) b = 4; else { b = 2; }');
   matchOutput('if (a === 5) { b = 4; } else if (a == 2) { b = 2; }');
});