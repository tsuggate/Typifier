import * as path from 'path';
import {readFile} from '../transpiler/util/file-reader';
import {jsParsers} from "./js-parsers";
import {parse} from "../transpiler/parser-lib/parsers-m";
import {define} from "../transpiler/js-parsers";



describe('print file', () => {

   const jsPath = path.resolve('test-files', 'simple.js');

   it('read the printed the file', () => {
      console.log(jsPath);

      const code = readFile(jsPath);
      expect(code).toBeTruthy();

      if (code) {
         const res = parse(define, code);
         console.log(JSON.stringify(res, null, 3));
      }

   });

});


jsParsers();
