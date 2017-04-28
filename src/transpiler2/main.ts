import {transpile} from '../test/shared';
import {readFile} from './util/file-reader';
import {inputFile, outputFile} from './util/args';
import * as fs from 'fs';

checkProgramArgs();
main();

function main() {
   const code = readFile(inputFile);

   if (code) {
      try {
         const tsCode = transpile(code, 'typescript');

         fs.writeFileSync(outputFile, tsCode);

         // console.log(tsCode);
      }
      catch (e) {
         console.log(e);
      }
   }
}

function checkProgramArgs() {
   if (!inputFile) {
      console.log('You need to provide an input file (use --file [file path]).');
      process.exit(0);
   }
   if (!outputFile) {
      console.log('You need to provide an output file (use --out [file path]).');
      process.exit(0);
   }
}