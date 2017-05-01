import * as path from 'path';
import * as fs from 'fs';
import {transpile} from '../test/shared';

let jsCode = '';

export function loadJsFile(): string {

   try {
      const filePath = path.join(process.cwd(), 'test-files', 'simple.js');
      const file = fs.readFileSync(filePath);
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