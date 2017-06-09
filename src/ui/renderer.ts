import {renderHome} from './home/home';
import {renderMainWindowMenu} from './home/menu';
import {initStore} from './state/state';
import {remote} from 'electron';
import {nextFile, previousFile} from './global-actions';
import {handleDevMode} from './util/dev-mode';


initStore();
renderMainWindowMenu();
renderHome();
handleDevMode();


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
