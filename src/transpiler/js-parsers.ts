import {parse, word, and, repSep, stringLiteral} from "./parser-lib/parsers-m";


export const define = word('define');

export const libsArray = and('[', repSep(stringLiteral, ','), ']');


// parse()