import {remote} from 'electron';
import {dispatch, getCodeState, getJavaScriptFile} from './state/state';
import * as fs from 'fs';
import {transpile} from '../transpiler2/transpiler-main';
import {getJavaScriptFilesInFolder, getTypeScriptFilePath} from './util/util';


export function getWindow(): Electron.BrowserWindow {
   return remote.getCurrentWindow();
}

export function clickOpenJsFile(): void {
   const filePath = showOpenJsFileWindow();

   if (filePath) {
      openJavaScriptFile(filePath);
   }
}

function showOpenJsFileWindow(): string | null {
   const files: string[] | undefined = remote.dialog.showOpenDialog(getWindow(), {
      properties: ['openFile'],
      filters: [{name: 'javascript', extensions: ['js']}]
   });

   if (files && files.length > 0) {
      return files[0];
   }
   return null;
}

export function clickOpenFolder(): void {
   const folderPath = showOpenFolderWindow();

   if (folderPath) {
      openFolder(folderPath);
   }
}

export function showOpenFolderWindow(): string | null {
   const paths: string[] | undefined = remote.dialog.showOpenDialog(getWindow(), {
      properties: ['openDirectory']
   });

   if (paths && paths.length > 0) {
      return paths[0];
   }
   return null;
}

export function openJavaScriptFile(file: string): void {
   dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
   getWindow().setTitle('kuraTranspiler - ' + file);

   generateTypeScript(file);
}

export function openFolder(folderPath: string): void {
   dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
   getWindow().setTitle('kuraTranspiler - ' + folderPath);

   const files = getJavaScriptFilesInFolder(folderPath);

   dispatch({type: 'SET_FOLDER', folderPath, javaScriptFiles: files});

   if (files[0]) {
      generateTypeScript(files[0]);
   }
}

function generateTypeScript(javaScriptFile: string) {
   const code = loadJavaScriptFile(javaScriptFile);

   if (code) {
      dispatch({type: 'SET_JAVASCRIPT_FILE', file: javaScriptFile, code});

      const tsCode = transpile(code, {language: 'typescript'});
      const success = !!tsCode;

      dispatch({type: 'SET_TYPESCRIPT_CODE', code: tsCode, success});

      if (success) {
         dispatch({type: 'SET_VIEW_MODE', mode: 'code'});
      }
   }
}

export function saveTypeScriptCode(): void {
   const jsFile = getJavaScriptFile();
   const tsFile = getTypeScriptFilePath();
   const code = getCodeState().typescriptCode;

   fs.writeFileSync(tsFile, code);

   fs.unlinkSync(jsFile);
   addLog(`Wrote ${tsFile}`);

   dispatch({type: 'CLOSE_FILE'});
}

export function addLog(log: string): void {
   dispatch({type: 'ADD_LOG', log});
}

export function appendLog(log: string): void {
   dispatch({type: 'ADD_LOG', log, sameLine: true});
}

export function nextFile(): void {
   const s = getCodeState();

   if (s.currentFileIndex < s.javascriptFiles.length - 1) {
      setFileIndex(s.currentFileIndex + 1);
   }
}

export function previousFile(): void {
   const s = getCodeState();

   if (s.currentFileIndex > 0) {
      setFileIndex(s.currentFileIndex - 1);
   }
}

function setFileIndex(index: number): void {
   const s = getCodeState();
   const jsFile = s.javascriptFiles[index];

   dispatch({type: 'SET_FILE_INDEX', index});

   generateTypeScript(jsFile);
}

export function loadJavaScriptFile(jsFile: string): string | null {
   if (!jsFile) {
      return null;
   }

   try {
      const file = fs.readFileSync(jsFile);
      const jsCode = file.toString();

      if (jsCode) {
         return jsCode;
      }
   }
   catch (e) {
      console.log(e);
      addLog(e);
   }
   return null;
}



