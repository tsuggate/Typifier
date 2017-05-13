import * as program from 'commander';

program
   .version('0.0.1')
   .option('-f, --file [file path]', 'File to convert.')
   .option('-o, --out [file path]', 'Path to output file.')
   .option('-d, --dev', 'Open dev tools on start.')
   .parse(process.argv);


export const inputFile = program['file'];
export const outputFile = program['out'];
export const devMode = !!program['dev'];

console.log('devMode: ', devMode);

