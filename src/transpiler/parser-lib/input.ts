
export interface IInputData {
  position: number;
  code: string;
}

// TODO: Fix up confusing naming.
export interface ParserResultData {
  parserId: number;
  succeeded: boolean;
  startingPos: number;
  endingPos: number;
  output: any;
}

export class Input {
  private code: string;
  private position: number;
  private parserResults: Array<Array<ParserResultData>> = [];

  constructor(code: string) {
    this.code = code;
    this.position = 0;
  }

  advance(): void {
    this.position += 1;
  }

  advanceBy(num: number): void {
    this.position += num;
  }

  getPosition(): number {
    return this.position;
  }

  setPosition(pos: number): void {
    this.position = pos;
  }

  nextChar(): string {
    return this.code[this.position];
  }

  prevChar(): string | null {
    if (this.position !== 0) {
      return this.code[this.position - 1];
    }
    else {
      return null;
    }
  }

  rest(): string {
    return this.code.slice(this.position);
  }

  saveParserResult(parserId: number, success: boolean, startingPos: number, output: any): void {
    if (this.parserResultExists(parserId)) {
      return;
    }

    if (!this.parserResults[startingPos]) {
      this.parserResults[startingPos] = [];
    }

    this.parserResults[startingPos][parserId] = {
      parserId: parserId,
      succeeded: success,
      startingPos: startingPos,
      endingPos: this.position,
      output: output
    };
  }

  parserResultExists(parserId: number): boolean {
    let a = this.parserResults[this.position];

    return !!a && !!a[parserId];
  }

  getParserResult(parserId: number): ParserResultData {
    let a = this.parserResults[this.position];

    return a[parserId];
  }

  snapShot(): Input {
    let snapShot = new Input(this.code);
    snapShot.setPosition(this.position);

    return snapShot;
  }

  getSlice(numChars: number): string {
    return this.code.slice(this.position, this.position + numChars);
  }

  getInputData(): IInputData {
    return {
      position: this.position,
      code: this.code
    };
  }
}
