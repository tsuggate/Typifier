import {__, and, ident, or, regex, repSep, stringLiteral} from "./parser-lib/parsers-m";


export const jsString = or(regex(/'([^'\\]|\\.)*'/), stringLiteral);

export const libsArray = and('[', repSep(jsString, ','), ']');

export const funcArgs = repSep(ident, ',');

export const funcAnon = and('function', __, '(', __, funcArgs, __, ')', __, '{', __,  '}');

export const define = and('define', __, '(', __, libsArray, __, ',', __, funcAnon, __, ')');


