import {__, and, ident, or, regex, repSep, stringLiteral} from "./parser-lib/parsers-m";
import {mkDefine, mkFuncAnon, mkJsString} from "./parser-types";
import {IParser, mkParser, noOutput} from './parser-lib/types';
import {Input} from './parser-lib/input';


export const jsString = or(regex(/'([^'\\]|\\.)*'/), stringLiteral)
  .map(mkJsString);

export const libsArray = and('[', repSep(jsString, ','), ']').map(res => res[1]);

export const funcArgs = repSep(ident, ',');

export const funcAnon = and('function', __, '(', __, funcArgs, __, ')', __, matchParens)
  .map(mkFuncAnon);

export const define = and('define', __, '(', __, libsArray, __, ',', __, funcAnon, __, ')')
  .map(mkDefine);



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
