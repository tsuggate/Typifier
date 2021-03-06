import {checkTSOutput, convertToTypescript} from './shared';


describe('one export', () => {
   checkTSOutput('define([], function() { var a = 5; return a; });', 'const a = 5;export = a;');
   checkTSOutput('define([], function() { var a = 5; return {a: a}; });', 'const a = 5;export = {a: a};');
   checkTSOutput('define([], function() { return {a: 5}; });', 'export = {a: 5};');
   checkTSOutput(`define(['a'], function(a) {return a.b;});`, `const a = require('a'); export = (a.b);`);
});

describe('multi export', () => {
   checkTSOutput(
      'define([], function() { var a = 5; var b = 6; return {a: a, b: b}; });',
      'export const a = 5;export const b = 6;'
   );
});

describe(`doesn't clash with common js`, () => {
   checkTSOutput(
      `var path = require('path'); module.exports = 5;`,
      `const path = require('path');module.exports = 5;`
   );
});

describe('misc', () => {

   it('detects mixed up import/exports', () => {
      expect(() => {
         convertToTypescript(
            `define(['something'], function(template) { var other = template + ' text'; var a = 5; return { template: other, a: a }; });`
         );
      }).toThrowError();
   });

});

describe('generate imports', () => {

   checkTSOutput(`import ctor from 'utility/ctor';`, `import ctor from 'utility/ctor';`);

   checkTSOutput(`const $ = require('jquery');`, `import * as $ from 'jquery';`);
   checkTSOutput(`const something = require('something');`, `const something = require('something');`);

});
