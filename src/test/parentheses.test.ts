import {matchOutput} from './shared';


describe('parentheses tests', () => {

   matchOutput('true || true');
   matchOutput('((true && true) || true) && true');

});
