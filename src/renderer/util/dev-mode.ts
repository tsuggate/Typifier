import * as path from 'path';
import {openFile, openFolder} from '../global-actions';
import * as os from 'os';
import {existsSync} from 'fs';
import {remote} from 'electron';


export function handleDevMode() {
   if (remote.getGlobal('devMode')) {
      devMode();
   }
}

function devMode(): void {
   const fileDemo = true;
   const slowFile = false;

   if (fileDemo) {
      if (!slowFile) {
         const simpleJs =path.join(__dirname, '..', 'test-files', 'comments.js');
         openFile(simpleJs);
      }
      else {
         const mainjs = path.join(os.homedir(), 'Documents', 'Repos', 'client', 'src', 'instance', 'js', 'plugins', 'categories', 'main.js');
         openFile(mainjs);
      }

   }
   else {
      const subFolder = path.join('client', 'src', 'instance', 'js', 'plugins');

      if (os.platform() === 'win32') {
         const folder = path.join(os.homedir(), 'Documents', 'Repos', subFolder);

         if (existsSync(folder))
            openFolder(folder);
      }
   }
}