import * as path from 'path';
import {readFile} from '../transpiler/util/file-reader';


describe('print file', () => {

   const jsPath = path.resolve('test-files', 'simple.js');

   it('read the printed the file', () => {
      console.log(jsPath);

      console.log(readFile(jsPath));

      expect(true).toEqual(true);
   });

});