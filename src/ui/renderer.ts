import {renderHome} from './home/home';
import {renderMainWindowMenu} from './home/menu';
import {nextFile, previousFile, setFolder, setJavascriptFile} from "./state/state";
import * as path from "path";
import {remote} from 'electron';
import * as os from 'os';
import {existsSync} from 'fs';


renderMainWindowMenu();
renderHome();

if (remote.getGlobal('devMode')) {
   // setJavascriptFile(path.join(__dirname, '..', 'test-files', 'comments.js'));

   const subFolder = path.join('client', 'src', 'instance', 'js', 'plugins');

   if (os.platform() === 'win32') {
      const folder = path.join(os.homedir(), 'Documents', 'Repos', subFolder);

      if (existsSync(folder))
         setFolder(folder);
   }
}

document.onkeydown = (e) => {
   e = e || window.event;

   switch(e.which) {
      case 37: // left
         e.preventDefault();
         previousFile();
         break;
      case 39: // right
         e.preventDefault();
         nextFile();
         break;
   }
};
