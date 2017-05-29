import {remote} from 'electron';
import {addLog, dispatch, getCodeState} from './state/state';
import * as fs from 'fs';
import {transpile} from '../transpiler2/transpiler-main';
import {getJavaScriptFilesInFolder} from './util/util';


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

   const code = loadJavaScriptFile2(file) || '';

   dispatch({type: 'SET_JAVASCRIPT_FILE', file, code});
   getWindow().setTitle('kuraTranspiler - ' + file);

   generateTypeScript(code);
}

export function openFolder(folderPath: string): void {
   dispatch({type: 'SET_VIEW_MODE', mode: 'log'});

   const files = getJavaScriptFilesInFolder(folderPath);

   setFolder(folderPath, files);
   getWindow().setTitle('kuraTranspiler - ' + folderPath);

   if (files[0]) {
      const code = loadJavaScriptFile2(files[0]) || '';
      dispatch({type: 'SET_JAVASCRIPT_FILE', file: files[0], code});
      generateTypeScript(code);
   }

}

function setFolder(folderPath: string, javaScriptFiles: string[]) {
   dispatch({type: 'SET_FOLDER', folderPath, javaScriptFiles});
   dispatch({type: 'SET_OPEN_MODE', mode: 'folder'});
}

function generateTypeScript(jsCode: string) {
   const tsCode = transpile(jsCode, {language: 'typescript'});
   const success = !!tsCode;

   dispatch({type: 'SET_TYPESCRIPT_CODE', code: tsCode, success});

   if (success)
      dispatch({type: 'SET_VIEW_MODE', mode: 'code'});
}

export function saveTypeScriptCode(): void {
   console.log('TODO: saveTypeScriptCode');
   // const jsFile = getJavaScriptFile();
   // const tsFile = getTypeScriptFilePath();
   // const code = getState().typescriptCode;
   //
   // fs.writeFileSync(tsFile, code);
   //
   // fs.unlinkSync(jsFile);
   // addLog(`Wrote ${tsFile}`);
   //
   // closeJavaScriptFile();
}

export function nextFile(): void {
   console.log('nextFile');
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
   console.log('setFileIndex');
   const s = getCodeState();
   const jsFile = s.javascriptFiles[index];
   const jsCode = loadJavaScriptFile2(jsFile);

   if (jsCode) {
      const tsCode = transpile(jsCode, {language: 'typescript'});
      const success = !!tsCode;

      dispatch({
         type: 'SET_FILE_INDEX',
         index, javaScriptCode:
         jsCode, typeScriptCode:
         tsCode || '',
         success
      });

      if (success)
         dispatch({type: 'SET_VIEW_MODE', mode: 'code'});
   }
}

export function loadJavaScriptFile2(jsFile: string): string | null {
   // const jsFile = getJavaScriptFile2();

   if (!jsFile) {
      return null;
   }

   try {
      const file = fs.readFileSync(jsFile);
      const jsCode = file.toString();

      if (jsCode) {
         // dispatch({type: 'SET_JAVASCRIPT_CODE', code: jsCode});
         return jsCode;
      }
   }
   catch (e) {
      console.log(e);
      addLog(e);
   }
   return null;
}


// export function generateTypeScript2(jsCode: string): string {
//    const tsCode = transpile(jsCode, {language: 'typescript'});
//
//    if (tsCode) {
//
//    }
// }

// export function generateTypescript(): boolean {
//    const jsCode = getState().javascriptCode;
//
//    const tsCode = transpile(jsCode, {language: 'typescript'});
//
//    if (tsCode) {
//       setTypescriptCode(tsCode);
//       return true;
//    }
//    setTypescriptCode('');
//    return false;
// }



