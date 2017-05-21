import {getTestFileCode} from '../transpiler2/util/file-reader';
import {run} from '../transpiler2/symbols/symbols';



describe('symbols', () => {
   const file = getTestFileCode('simple');

   it('show output', () => {
      if (file) {
         run(file);
      }

      expect(true).toBe(true);
   });

});

