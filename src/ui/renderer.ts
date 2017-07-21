import {renderHome} from './home/home';
import {renderMainWindowMenu} from './home/menu';
import {initStore} from './state/state';
import {remote} from 'electron';
import {nextFile, openFile, previousFile} from './global-actions';
import {handleDevMode} from './util/dev-mode';


initStore();
renderMainWindowMenu();
renderHome();
handleDevMode();
openFileArg();


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

function openFileArg(): void {
   const openFileArg = remote.getGlobal('openFileArg');

   if (openFileArg) {
      openFile(openFileArg).catch(e => console.log(e));
   }
}
