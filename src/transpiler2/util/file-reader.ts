import * as fs from 'fs';
import * as path from 'path';



export function getTestFile(name: string): string | null {
   const file = path.resolve('test-files', `${name}.js`);

   try {
      return readFile(file);
   }
   catch (e) {
      return null;
   }
}

export function readFile(filePath: string): string | null {
   try {
      const buffer = fs.readFileSync(filePath);

      return buffer.toString();
   }
   catch (e) {
      return null;
   }
}
