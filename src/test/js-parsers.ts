import {parse} from "../transpiler/parser-lib/parsers-m";
import {libsArray} from "../transpiler/js-parsers";



export function jsParsers() {
  describe('libsArray', () => {
    it(`['jquery', 'underscore']`, () => {
      const res = parse(libsArray, `["jquery", "underscore"]`);

      console.log('res: ', res);
    });
  });
}

