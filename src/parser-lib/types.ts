import {IInputData, Input} from "./input";


let nextParserId = 1;

export function getNextParserId(): number {
  const parserId = nextParserId;
  nextParserId++;

  return parserId;
}

export type NoResult = null;
export const noOutput: NoResult = null;

export type ParserResult = any;

export type SuccessFunc = (result: ParserResult) => any;
export type FailFunc = (input: IInputData, extra?: Object) => any;

export interface RawParser {
  apply: (input: Input) => any;
  map: (success: SuccessFunc) => IParser;
  fail: (fail: FailFunc) => IParser;
  parserId: number;
}

export type WrappedParser = (() => RawParser);

export type IParser2 = RawParser | WrappedParser;

export type IParser = RawParser;

export function mkParser(applyFunc: (input: Input, success: SuccessFunc, failure: FailFunc) => any): IParser {
  let successFuncs: SuccessFunc[] = [];
  let failFunc: FailFunc;

  let handleFail = (inputData: IInputData, extra?: Object) => {
    if (failFunc) {
      return failFunc(inputData, extra);
    }
    else {
      return noOutput;
    }
  };

  let handleSuccess = (result: any) => {
    return successFuncs.reduce((partialResult, f) => {
      return f(partialResult);
    }, result);
  };

  let self: IParser = {
    apply: (input: Input) => {
      return applyFunc(input, handleSuccess, handleFail);
    },
    map: (f: SuccessFunc) => {
      successFuncs.push(f);

      return self;
    },
    fail: (f: FailFunc) => {
      failFunc = f;

      return self;
    },
    parserId: getNextParserId()
  };

  return self;
}
