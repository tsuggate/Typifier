import {Operator, operatorPrecedence} from '../transpiler2/output/generators/operators';


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
});