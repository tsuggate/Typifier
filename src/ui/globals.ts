import {remote} from 'electron';
import {renderHome} from './home/home';
import {setJsFilePath} from '../data/data';


export function getWindow(): Electron.BrowserWindow {
   return remote.getCurrentWindow();
}

export function clickOpenJsFile(): void {
   const filePath = openJsFile();

   console.log(filePath);

   if (filePath) {
      setJsFilePath(filePath);
      rerenderHome();
   }
}

function openJsFile(): string | null {
   const files: string[] | undefined = remote.dialog.showOpenDialog(getWindow(), {
      properties: ['openFile'],
      filters: [{name: 'javascript', extensions: ['js']}]
   });

   if (files && files.length > 0) {
      return files[0];
   }
   return null;
}

export function rerenderHome(): void {
   renderHome();
}