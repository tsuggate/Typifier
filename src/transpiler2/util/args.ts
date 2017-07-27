import * as program from 'commander';
import * as path from 'path';

const packageJson = require('../../../package.json');

export let openFileArg;
export let devMode;


parseArgs(process.argv, () => {});

// Need strange callback workaround for when parsing args of second instance of this app.
export function parseArgs(argsIn: string[], cb: (program: any) => void): void {
   const args = atLeastTwoArgs(argsIn);

   program
      .version(packageJson.version)
      .option('--help')
      .option('--open [file]', 'Open a file.')
      .option('-d, --dev', 'Open dev tools on start.')
      .parse(args);

   openFileArg = program['open'];
   devMode = !!program['dev'];

   if (!program['open']) {
      if (args[2] && args[2].endsWith('.js')) {
         openFileArg = args[2];
      }
      else if (args[0].endsWith('.exe') && args[1].endsWith('.js')) {
         openFileArg = args[1];
      }
   }

   global['devMode'] = devMode;
   global['openFileArg'] = openFileArg;

   cb(program);

   program.version(packageJson.version).parse(['', '']);
}

// Commander expects `args.length` to be at least 2 (node.exe followed
// by the JavaScript file), but electron can launch apps without any
// arguments. This adds a dummy argument.
function atLeastTwoArgs(args: string[]): string[] {
   if (path.basename(args[0]).startsWith(packageJson.name)) {
      return [ args[0], '', ...args.slice(1) ];
   }

   if (args.length >= 2)
      return args;
   return [ ...args.slice(), '' ];
}
