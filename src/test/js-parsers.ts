import {parse} from "../transpiler/parser-lib/parsers-m";
import {define, funcAnon, libsArray} from "../transpiler/js-parsers";
import {FuncAnon} from "../transpiler/parser-types";


export function jsParsers() {

  describe('libsArray', () => {
    it(`['jquery', 'underscore']`, () => {
      const res = parse(libsArray, `['jquery', 'underscore']`);

      expect(res).toBeTruthy();
      // console.log('res: ', res);
    });
  });

  describe('funcAnon', () => {
    const code = 'function($, b, c) { }';

    it(code, () => {
      const res = parse(funcAnon, code);

      if (res) {
        const fa = res as FuncAnon;
        expect(fa.type).toBe('FuncAnon');
      }
    });
  });

  describe('define', () => {
    const code = `define(['jquery'], function($) {});`;

    it(code, () => {
      const res = parse(define, code);

      expect(res).toBeTruthy();

      // console.log(res);
    });
  });

}

