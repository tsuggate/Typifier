import {remote} from 'electron';
import {dispatch, getAppState, getCodeState, getJavaScriptFile} from './state/state';
import * as fs from 'fs';
import {transpile} from '../transpiler2/transpiler-main';
import {getJavaScriptFilesInFolder, getTypeScriptFilePath} from './util/util';
import * as diff from 'diff';
import {IDiffResult} from 'diff';
import * as _ from 'underscore';


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
   dispatch({type: 'SET_OPEN_MODE', mode: 'file'});

   getWindow().setTitle('kuraTranspiler - ' + file);

   generateTypeScript(file);
}

export function openFolder(folderPath: string, index: number = 0): void {
   dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
   getWindow().setTitle('kuraTranspiler - ' + folderPath);

   const files = getJavaScriptFilesInFolder(folderPath);

   dispatch({type: 'SET_FOLDER', folderPath, javaScriptFiles: files, index});

   if (files[0]) {
      generateTypeScript(files[0]);
   }
}

function generateTypeScript(javaScriptFile: string) {
   const code = loadJavaScriptFile(javaScriptFile);

   if (code) {
      dispatch({type: 'SET_JAVASCRIPT_FILE', file: javaScriptFile, code});

      const t1 = _.now();

      const tsCode = transpile(code, {language: 'typescript'});
      const success = !!tsCode;

      if (tsCode) {
         const diffs = generateDiffs(code, tsCode);

         dispatch({type: 'SET_TYPESCRIPT_CODE', code: tsCode, success, diffs});
      }

      if (success) {
         dispatch({type: 'SET_VIEW_MODE', mode: 'diff'});
      }
      else {
         dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
      }

      addLogLn(`Total Time: ${_.now() - t1}ms`);
   }
}

function generateDiffs(javaScript: string, typeScript: string): IDiffResult[] {
   const t1 = _.now();

   addLogLn('Generating diffs...');

   const diffs = diff.diffWords(javaScript, typeScript);

   addLog(` OK - ${_.now() - t1}ms`);

   return diffs;
}

export function saveTypeScriptCode(): void {
   const codeState = getCodeState();

   const jsFile = getJavaScriptFile();
   const tsFile = getTypeScriptFilePath();
   const code = codeState.typescriptCode;

   fs.writeFileSync(tsFile, code);

   fs.unlinkSync(jsFile);
   addLogLn(`Wrote ${tsFile}`);

   if (getAppState().openMode === 'file') {
      dispatch({type: 'CLOSE_FILE'});
   }
   else {
      if (codeState.folderPath) {
         openFolder(codeState.folderPath, codeState.currentFileIndex);
      }
   }
}

export function addLogLn(log: string): void {
   dispatch({type: 'ADD_LOG', log});
}

export function addLog(log: string): void {
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
   dispatch({type: 'CLEAR_LOGS'});
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
      addLogLn(e);
   }
   return null;
}



