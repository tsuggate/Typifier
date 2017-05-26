import {renderHome} from './home/home';
import {renderMainWindowMenu} from './home/menu';
import {nextFile, previousFile, setFolder, setJavascriptFile} from "./state/state";
import * as path from "path";
import {remote} from 'electron';


renderMainWindowMenu();
renderHome();

if (remote.getGlobal('devMode')) {
   // setJavascriptFile(path.join(__dirname, '..', 'test-files', 'comments.js'));

   setFolder('/Users/tobysuggate/Downloads/client/src/instance/js/plugins');
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
