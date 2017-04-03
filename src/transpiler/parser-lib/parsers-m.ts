import {Input} from "./input";
import * as util from "./util";
import {noOutput, SuccessFunc, FailFunc, RawParser, WrappedParser, IParser, IParser2, mkParser} from "./types";


export const __: IParser = optionalWhiteSpace();

export const number: IParser = regex(/-?(\d+(\.\d+)?)/);

export const stringLiteral: IParser = regex(/"([^"\\]|\\.)*"/);

export const ident: IParser = regex(/^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*/);

function isComment(input: Input): boolean {
  return input.getSlice(2) === '//';
}

// Expects a single character.
function isWhiteSpace(c: string): boolean {
  return c === ' ' || isEOL(c) || c === '\t';
}

// Expects a single character.
export function isEOL(c: string) {
  return  c === '\n' || c === '\r';
}

export function char(c: string): IParser {
  return mkParser((input: Input, handleResult) => {
    let r = input.nextChar();

    let result: any | null = noOutput;

    if (r === c) {
      input.advance();
      result = c;
    }
    return handleResult(result);
  });
}

export function word(str: string): IParser {
  return mkParser((input: Input, handleResult) => {
    const charList = str.split('');
    const pos = input.getPosition();

    for (let i = 0; i < charList.length; i++) {
      if (input.nextChar() === charList[i]) {
        input.advance();
      }
      else {
        input.setPosition(pos);
        return noOutput;
      }
    }
    return handleResult(str);
  });
}

export function optionalWhiteSpace(): IParser {
  return mkParser((input: Input, handleResult) => {
    while (isWhiteSpace(input.nextChar()) || isComment(input)) {
      if (isComment(input)) {
        input.advanceToEndOfLine();
      }
      else {
        input.advance();
      }
    }

    return handleResult('');
  });
}

export function regex(re: RegExp): IParser {
  return mkParser((input: Input, success: SuccessFunc) => {
    const code = input.rest();
    const match = re.exec(code);

    if (match !== null && match.index === 0) {
      const result = match[0];
      input.advanceBy(result.length);
      return success(result);
    }
    else {
      return noOutput;
    }
  });
}

export function or(...args: Array<IParser2 | string>): IParser {
  const parsers: IParser[] = args.map((arg) => {
    return util.isString(arg) ? word(arg as string) as IParser : arg as IParser;
  });

  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    for (let i = 0; i < parsers.length; i++) {
      const result = applyParser(parsers[i], input);

      if (result !== noOutput) {
        return success(result);
      }
    }
    fail(input.getInputData());
    return noOutput;
  });
}


// Array returned doesn't contain '' values.
export function and2(...parsers: Array<IParser2>): IParser {
  // const parsers: IParser[] = args.map((arg) => {
  //   return util.isString(arg) ? word(arg as string) as IParser : arg as IParser;
  // });

  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    const pos = input.getPosition();
    let results: any[] = [];

    for (let i = 0; i < parsers.length; i++) {
      let result = applyParser(parsers[i], input);

      if (result === noOutput) {
        fail(input.getInputData(), {parserIndex: i});

        input.setPosition(pos);
        return noOutput;
      }
      else if (result !== '') {
        results.push(result);
      }
    }

    return success(results);
  });
}


// Array returned doesn't contain '' values.
// Auto converts plain strings to word parsers.
export function and(...args: Array<IParser2 | string>): IParser {
  const parsers: IParser[] = args.map((arg) => {
    return util.isString(arg) ? word(arg as string) as IParser : arg as IParser;
  });

  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    const pos = input.getPosition();
    let results: any[] = [];

    for (let i = 0; i < parsers.length; i++) {
      let result = applyParser(parsers[i], input);

      if (result === noOutput) {
        fail(input.getInputData(), {parserIndex: i});

        input.setPosition(pos);
        return noOutput;
      }
      else if (result !== '') {
        results.push(result);
      }
    }

    return success(results);
  });
}

// Doesn't advance position
export function not(parserIn: string | IParser): IParser {
  const parser = (util.isString(parserIn) ? word(parserIn as string) : parserIn) as IParser;

  return mkParser((input: Input, success) => {
    const pos = input.getPosition();
    const result = applyParser(parser, input);

    if (result !== noOutput) {
      input.setPosition(pos);

      return noOutput;
    }
    return success('');
  });
}

export function many(parser: IParser2): IParser {
  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    let results: any[] = [];

    let result = applyParser(parser, input);
    while (result !== null) {
      results.push(result);
      result = applyParser(parser, input);
    }
    return success(results);
  });
}

export function many1(parser: IParser2): IParser {
  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    let results: any[] = [];

    let result = applyParser(parser, input);
    while (result !== null) {
      results.push(result);
      result = applyParser(parser, input);
    }

    if (results.length > 0) {
      return success(results);
    }
    fail(input.getInputData());
    return noOutput;
  });
}

// Always succeeds
export function repSep(parser: IParser2, separator: string): IParser {
  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    let results: any[] = [];
    let sepParser = and2(__, word(separator), __);

    let result = applyParser(parser, input);
    while (result !== noOutput) {
      results.push(result);

      let sepRes = applyParser(sepParser, input);
      if (sepRes !== noOutput) {
        result = applyParser(parser, input);
      }
      else {
        result = noOutput;
      }
    }

    return success(results);
  });
}

export function repParserSep(parser: IParser2, separator: IParser2): IParser {
  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    let results: any[] = [];

    let result = applyParser(parser, input);
    while (result !== noOutput) {
      results.push(result);

      let sepRes = applyParser(separator, input);
      if (sepRes !== noOutput) {
        result = applyParser(parser, input);
      }
      else {
        result = noOutput;
      }
    }

    return success(results);
  });
}

export function parseAndPrint(parser: IParser, text: string) {
  let input = new Input(text);
  let result = applyParser(parser, input);
  if (result === null) {
    console.log('Compile failed.');
  }
  else {
    console.log(result);
  }
}

export function parse(parser: IParser2, code: string) {
  const input = new Input(code);
  return applyParser(parser, input);
}

export function unwrapParser(parser: IParser2): RawParser {
  if (parser['length'] ===0) {
    const wrappedParser = parser as WrappedParser;
    return wrappedParser();
  }
  return parser as RawParser;
}

export function getParserOutput(parser: RawParser, input: Input) {
  if (input.parserResultExists(parser.parserId)) {
    const res = input.getParserResult(parser.parserId);
    input.setPosition(res.endingPos);

    return res.output;
  }
  else {
    const pos = input.getPosition();
    const output = parser.apply(input);
    const success = output !== noOutput;

    if (output !== '') {
      input.saveParserResult(parser.parserId, success, pos, output);
    }
    return output;
  }
}

export function applyParser(parser: IParser2, input: Input) {
  const rawParser = unwrapParser(parser);

  return getParserOutput(rawParser, input);
}
