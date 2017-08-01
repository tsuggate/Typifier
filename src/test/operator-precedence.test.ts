import {Operator, operatorPrecedence} from '../transpiler/output/generators/operators';
import {matchOutputRaw} from './shared';


function checkPrecedence(operator: Operator, expectedPrecedence: number) {
   it(operator, () => {
      const precedence = operatorPrecedence(operator);

      expect(precedence).toEqual(expectedPrecedence);
   });
}

/*

Check that the general precedence function actually works.

 */
describe('operator precedence', () => {
   checkPrecedence('&&', 6);
   checkPrecedence('||', 5);
   checkPrecedence('+', 13);

   matchOutputRaw(`uploadInProgress() && (viewModel.panelState == panelState || disposed)`);
});