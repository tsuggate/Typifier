import * as path from "path";
import {readFile} from "../transpiler/util/file-reader";
import {diffOutput, saveOutput} from "./shared";


describe('big file', () => {
   const jsPath = path.resolve('..', '..', 'Downloads', 'client', 'src', 'instance', 'js', 'plugins', 'image-annotation', 'main.js');

   // /Users/tobysuggate/Downloads/client/src/instance/js/plugins/image-annotation/main.js

   const code = readFile(jsPath);

   if (code) {
      // matchOutput(code);
      // logOutput(code);
      diffOutput(code);
      // saveOutput(code);

   }

});