import {remote} from 'electron';
import {dispatch, getAppState, getCodeState, getJavaScriptFile} from './state/state';
import * as fs from 'fs';
import {transpile} from '../transpiler2/transpiler-main';
import {getJavaScriptFilesInFolder, getTypeScriptFilePath} from './util/util';
import * as diff from 'diff';
import {IDiffResult} from 'diff';
import * as _ from 'underscore';
import {addLog, addLogLn, logProgress} from './home/log/logger';


export function getWindow(): Electron.BrowserWindow {
   return remote.getCurrentWindow();
}

export async function clickOpenJsFile(): Promise<void> {
   const filePath = showOpenJsFileWindow();

   if (filePath) {
      await openFile(filePath);
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

export async function clickOpenFolder(): Promise<void> {
   const folderPath = showOpenFolderWindow();

   if (folderPath) {
      await openFolder(folderPath);
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

export async function openFile(file: string): Promise<void> {
   dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
   dispatch({type: 'SET_OPEN_MODE', mode: 'file'});

   getWindow().setTitle('kuraTranspiler - ' + file);

   await generateTypeScript(file);
}

export async function openFolder(folderPath: string, index: number = 0): Promise<void> {
   dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
   getWindow().setTitle('kuraTranspiler - ' + folderPath);

   const files = getJavaScriptFilesInFolder(folderPath);

   dispatch({type: 'SET_FOLDER', folderPath, javaScriptFiles: files, index});

   if (files[0]) {
      await generateTypeScript(files[0]);
   }
}

async function generateTypeScript(javaScriptFile: string): Promise<void> {
   const code = await loadJavaScriptFile(javaScriptFile);

   if (code) {
      dispatch({type: 'SET_JAVASCRIPT_FILE', file: javaScriptFile, code});

      const t1 = _.now();

      const tsCode = await transpile(code, {language: 'typescript'});
      const success = !!tsCode;

      if (tsCode) {
         const diffs = await generateDiffs(code, tsCode);

         dispatch({type: 'SET_TYPESCRIPT_CODE', code: tsCode, success, diffs});
      }

      if (success) {
         dispatch({type: 'SET_VIEW_MODE', mode: 'code'});
      }
      else {
         dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
      }

      addLogLn(`Total Time: ${_.now() - t1}ms`);
   }
}

function generateDiffs(javaScript: string, typeScript: string): Promise<IDiffResult[]> {
   return logProgress<IDiffResult[]>('Generating diffs', () => diff.diffWords(javaScript, typeScript));
}

export async function saveTypeScriptCode(): Promise<void> {
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
         await openFolder(codeState.folderPath, codeState.currentFileIndex);
      }
   }
}

// export function addLogLn(log: string): void {
//    dispatch({type: 'ADD_LOG', log});
// }
//
// export function addLog(log: string): void {
//    dispatch({type: 'ADD_LOG', log, sameLine: true});
// }

export async function nextFile(): Promise<void> {
   const s = getCodeState();

   if (s.currentFileIndex < s.javascriptFiles.length - 1) {
      await setFileIndex(s.currentFileIndex + 1);
   }
}

export async function previousFile(): Promise<void> {
   const s = getCodeState();

   if (s.currentFileIndex > 0) {
      await setFileIndex(s.currentFileIndex - 1);
   }
}

async function setFileIndex(index: number): Promise<void> {
   dispatch({type: 'CLEAR_LOGS'});
   dispatch({type: 'SET_VIEW_MODE', mode: 'log'});

   const s = getCodeState();
   const jsFile = s.javascriptFiles[index];

   dispatch({type: 'SET_FILE_INDEX', index});
   await generateTypeScript(jsFile);
}

export async function loadJavaScriptFile(jsFile: string): Promise<string | null> {
   if (!jsFile) {
      return null;
   }

   return await readFile(jsFile);
   // try {
   //    const jsCode = await readFile(jsFile);
   //
   //    if (jsCode) {
   //       return jsCode;
   //    }
   // }
   // catch (e) {
   //    console.log(e);
   //    addLogLn(e);
   // }
   // return null;
}

function readFile(file: string): Promise<string | null> {
   return new Promise<string | null>((resolve) => {
      fs.readFile(file, (e, data) => {
         if (e) {
            console.log(e);
            addLogLn(`${e.stack ? e.stack : e}`);
            resolve(null);
         }
         else {
            resolve(data.toString());
         }
      });
   })
}

