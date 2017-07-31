import {checkTSOutput, matchOutput} from './shared';


describe('any insertion', () => {

   describe('empty array', () => {
      matchOutput('var a = [];');
      checkTSOutput('var a = [];', 'const a: any[] = [];');
   });

   describe('empty object', () => {
      checkTSOutput('var o = {};', 'const o: Record<string, any> = {};');
   });

   describe('not inserted in for-in loop', () => {
      checkTSOutput('for (var a in array) {}', 'for (const a in array) {}');
   })
});


describe('export scenarios', () => {

   describe('one export', () => {
      checkTSOutput('define([], function() { var a = 5; return a; });', 'const a = 5;export = a;');
      checkTSOutput('define([], function() { var a = 5; return {a: a}; });', 'const a = 5;export = {a: a};');
   });

   describe('multi export', () => {
      checkTSOutput(
         'define([], function() { var a = 5; var b = 6; return {a: a, b: b}; });',
         'export const a = 5;export const b = 6;'
      );
   });

});