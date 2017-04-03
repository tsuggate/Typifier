import * as path from 'path';
import {readFile} from '../transpiler/util/file-reader';
import {jsParsers} from "./js-parsers";
import {parse} from "../transpiler/parser-lib/parsers-m";
import {define} from "../transpiler/js-parsers";



describe('print file', () => {

   const jsPath = path.resolve('test-files', 'simple.js');


   const jsPath2 = path.resolve('..', 'client', 'src', 'instance', 'js', 'plugins', 'image-annotation', 'main.js');

   it('read the printed the file', () => {
      const code = readFile(jsPath2);
      // console.log(code);

      expect(code).toBeTruthy();

      if (code) {
         const res = parse(define, code);
         console.log(JSON.stringify(res, null, 3));
      }

   });

});


jsParsers();
