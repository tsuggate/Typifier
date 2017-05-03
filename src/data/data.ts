import * as path from 'path';
import * as fs from 'fs';
import {transpile} from '../transpiler2/transpiler-main';


let jsFilePath = path.join(process.cwd(), 'test-files', 'simple.js');


export function setJsFilePath(filePath: string): void {
   jsFilePath = filePath;
}

export function getJsFilePath(): string {
   return jsFilePath;
}

let jsCode = '';

export function loadJsFile(): string {
   try {
      const file = fs.readFileSync(jsFilePath);
      jsCode = file.toString();
   }
   catch (e) {
      console.log(e);
   }

   return jsCode;
}

export function getTsOutput(): string {
   return transpile(jsCode, 'typescript');
}
