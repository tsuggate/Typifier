import {__, and, ident, or, regex, repSep, stringLiteral} from "./parser-lib/parsers-m";
import {mkDefine, mkFuncAnon, mkJsString} from "./parser-types";
import {IParser, mkParser, noOutput} from './parser-lib/types';
import {IInputData, Input} from './parser-lib/input';


export const jsString = or(regex(/'([^'\\]|\\.)*'/), stringLiteral)
  .map(mkJsString);

export const libsArray = and('[', __, repSep(jsString, ','), __, ']').map(res => res[1]);

export const funcArgs = repSep(ident, ',');

export const ignoreBlock = and(matchParens).map(res => ({}));

export const funcAnon = and('function', __, '(', __, funcArgs, __, ')', __, ignoreBlock)
  .map(mkFuncAnon);

export const define = and('define', __, '(', __, libsArray, __, ',', __, funcAnon, __, ')')
  .map(mkDefine).fail((input: IInputData, extra: Object) => {
      console.log('Failed to parse code.');

      if (input && input.code) {
         console.log(input.code.slice(input.position, 100));
      }

      if (extra) {
         console.log('extra: ', extra);
      }
   });

export function matchParens(): IParser {
   return mkParser((input: Input, handleResult) => {
      const pos = input.getPosition();
      
      const c = input.nextChar();
      
      if (c === '{') {
         let nesting = 1;
         
         while (nesting !== 0) {
            input.advance();
            const nextChar = input.nextChar();
            
            if (nextChar === '{') {
               nesting++;
            }
            else if (nextChar === '}') {
               nesting--;
            }
         }
         input.advance();
         return handleResult(input.getSlice2(pos, input.getPosition()));
      }
      else {
         input.setPosition(pos);
         return noOutput;
      }
   });
}
