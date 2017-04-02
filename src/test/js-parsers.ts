import {parse} from "../transpiler/parser-lib/parsers-m";
import {define, funcAnon, libsArray} from "../transpiler/js-parsers";


export function jsParsers() {

  describe('libsArray', () => {
    it(`['jquery', 'underscore']`, () => {
      const res = parse(libsArray, `['jquery', 'underscore']`);

      console.log('res: ', res);
    });
  });

  describe('funcAnon', () => {
    const code = 'function($, b, c) { }';

    it(code, () => {
      const res = parse(funcAnon, code);
      console.log(res);
    });
  });

  describe('define', () => {
    const code = `define(['jquery'], function($) {});`;

    it(code, () => {
      const res = parse(define, code);
      console.log(res);
    });
  });

}

