import {matchOutput} from './shared';


describe('parentheses tests', () => {

   matchOutput('true || true');
   matchOutput('((true && true) || true) && true');
   matchOutput('var end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;');

});
