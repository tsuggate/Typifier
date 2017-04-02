import {__, and, ident, or, regex, repSep, stringLiteral} from "./parser-lib/parsers-m";
import {mkDefine, mkFuncAnon, mkJsString} from "./parser-types";


export const jsString = or(regex(/'([^'\\]|\\.)*'/), stringLiteral)
  .map(mkJsString);

export const libsArray = and('[', repSep(jsString, ','), ']').map(res => res[1]);

export const funcArgs = repSep(ident, ',');

export const funcAnon = and('function', __, '(', __, funcArgs, __, ')', __, '{', __,  '}')
  .map(mkFuncAnon);

export const define = and('define', __, '(', __, libsArray, __, ',', __, funcAnon, __, ')')
  .map(mkDefine);


