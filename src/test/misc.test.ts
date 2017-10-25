import {checkTSOutput, matchOutput} from './shared';


describe('any insertion', () => {

   describe('empty array', () => {
      matchOutput('var a = [];');
      checkTSOutput('var a = [];', 'const a: any[] = [];');
   });

   describe('empty object', () => {
      checkTSOutput('var o = {};', 'const o: Record<string, any> = {};');
   });

   describe('spread operator', () => {
      checkTSOutput('var l = [a, ...b];', 'const l = [a, ...b];');
   });

   xdescribe('method style properties', () => {
      checkTSOutput('var o = {a() {}};', 'const o = {a() {}};');
   });

   describe('empty variable', () => {
      matchOutput('var a = null;');
      checkTSOutput('var a = null;', 'const a: any = null;');

      matchOutput('var a = undefined;');
      checkTSOutput('var a = undefined;', 'const a: any = undefined;');
   });

   describe('not inserted in for-in loop', () => {
      checkTSOutput('for (var a in array) {}', 'for (const a in array) {}');
   });

   describe('assignments in parameters', () => {
      checkTSOutput('function t(a = []) {}', 'function t(a: any = []) {}');
      checkTSOutput('var f = (a = []) => {};', 'const f = (a: any = []) => {};');
   });

   describe(`remove bind on functions that don't use "this"`, () => {
      checkTSOutput('const a = function() {}.bind(this);', 'const a = () => {};');
      checkTSOutput('const a = function() {this.a = 5;}.bind(this);', 'const a = function(this: any) {this.a = 5;}.bind(this);');
      checkTSOutput('const a = function() {this.a = 5;};', 'const a = function(this: any) {this.a = 5;};');
      checkTSOutput('const a = ko.computed(function() {return this.a();}.bind(this));',
         'const a = ko.computed(function(this: any) {return this.a();}.bind(this));');
   });

});
