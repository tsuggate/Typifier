import {renderHome} from './home/home';
import {renderMainWindowMenu} from './home/menu';
import {initStore} from './state/state';
import * as path from 'path';
import {remote} from 'electron';
import {nextFile, openFolder, openFile, previousFile} from './global-actions';
import * as os from 'os';
import {existsSync} from 'fs';


initStore();
renderMainWindowMenu();
renderHome();


if (remote.getGlobal('devMode')) {

   const fileDemo = true;

   if (fileDemo) {
      const simpleJs =path.join(__dirname, '..', 'test-files', 'simple.js');
      openFile(simpleJs);
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

document.onkeydown = async (e) => {
   e = e || window.event;

   switch(e.which) {
      case 37: // left
         e.preventDefault();
         await previousFile();
         break;
      case 39: // right
         e.preventDefault();
         await nextFile();
         break;
   }
};
