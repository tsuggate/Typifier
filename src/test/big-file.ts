import * as path from "path";
import {readFile} from "../transpiler/util/file-reader";
import {diffOutput, matchOutput, saveOutput} from "./shared";


describe('big file', () => {
   const root1 = path.resolve('..', '..', 'Downloads');
   const root2 = path.resolve('..');

   const jsPath = path.join(root2, 'client', 'src', 'instance', 'js', 'plugins', 'image-annotation', 'main.js');

   const code = readFile(jsPath);

   if (code) {
      // matchOutput(code);
      // logOutput(code);
      diffOutput(code);
      saveOutput(code);
   }
   else {
      console.log('Big file path not valid: ', jsPath);
   }
});