import {checkTSOutput, matchOutput} from './shared';


describe('empty array', () => {

   matchOutput('var a = [];');
   checkTSOutput('var a = [];', 'const a: any[] = [];');

});