import * as fs from 'fs';


export function readFile(filePath: string): string | null {
   try {
      const buffer = fs.readFileSync(filePath);

      return buffer.toString();
   }
   catch (e) {
      return null;
   }
}