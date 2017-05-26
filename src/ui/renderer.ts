import {renderHome} from './home/home';
import {renderMainWindowMenu} from './home/menu';
import {nextFile, previousFile, setJavascriptFile} from "./state/state";
import * as path from "path";


renderMainWindowMenu();
renderHome();


setJavascriptFile(path.join(__dirname, '..', 'test-files', 'comments.js'));

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
