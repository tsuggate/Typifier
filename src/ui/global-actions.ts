import {remote} from 'electron';
import {appendLog, getState, setJavascriptCode, setJavascriptFile, setTypescriptCode} from './home/state';
import * as fs from 'fs';
import {transpile} from '../transpiler2/transpiler-main';


export function getWindow(): Electron.BrowserWindow {
   return remote.getCurrentWindow();
}

export function clickOpenJsFile(): void {
   const filePath = openJsFile();

   console.log(filePath);

   if (filePath) {
      setJavascriptFile(filePath);
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

export function loadJavascriptFile(): void {
   const jsFile = getState().javascriptFile;

   try {
      const file = fs.readFileSync(jsFile);
      const jsCode = file.toString();

      if (jsCode) {
         appendLog('Successfully read ' + jsFile);
         setJavascriptCode(jsCode);
      }
   }
   catch (e) {
      console.log(e);
      appendLog(e);
   }
}

export function generateTypescript(): boolean {
   const jsCode = getState().javascriptCode;

   const tsCode = transpile(jsCode, {language: 'typescript'});

   if (tsCode) {
      setTypescriptCode(tsCode);
      return true;
   }
   setTypescriptCode('');
   return false;
}