import {checkTSOutput, matchOutput} from './shared';


describe('parentheses tests', () => {
   matchOutput('true || true');
   matchOutput('((true && true) || true) && true');
   matchOutput('var end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;');

   matchOutput('val = +(+val).toFixed(3);');

   matchOutput('var f = a => a * a;');

   checkTSOutput('var s = "a" + "b" + "c" + "d";', 'const s = "a" + "b" + "c" + "d";');

   checkTSOutput('(5).toString();', '(5).toString();');
   checkTSOutput('(n * 5).toString();', '(n * 5).toString();');
});
