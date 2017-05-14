import {renderHome} from '../home/home';
import {generateTypescript, getWindow, loadJavascriptFile} from '../global-actions';
import {State, ViewMode} from "./schema";
import {getJavaScriptFilesInFolder} from "../util/util";


let state: State = {
   viewMode: 'log',
   openMode: 'file',
   folderInfo: null,
   javascriptFile: '',
   javascriptCode: '',
   typescriptCode: '',
   codeGenSucceeded: false,
   logs: []
};

export function getState(): State {
   return state;
}

export function setViewMode(viewMode: ViewMode): void {
   state.viewMode = viewMode;
   renderHome();
}

export function setCodeGenSuccess(succeeded: boolean): void {
   state.codeGenSucceeded = succeeded;

   if (succeeded) {
      setViewMode('code');
   }

   renderHome();
}

export function addLog(log: string): void {
   state.logs.push(log);
   renderHome();
}

export function appendLog(log: string): void {
   state.logs[state.logs.length - 1] += log;
   renderHome();
}

export function setFolder(folderPath: string): void {
   state.openMode = 'folder';

   state.folderInfo = {
      folderPath,
      javascriptFiles: getJavaScriptFilesInFolder(folderPath),
      currentFileIndex: 0
   };

   console.log(state.folderInfo.javascriptFiles.length);
   loadJavascriptFile();

   const success = generateTypescript();

   setCodeGenSuccess(success);

   renderHome();
   getWindow().setTitle('kuraTranspiler - ' + folderPath);
}

export function setJavascriptFile(file: string): void {
   clearLogs();

   state.javascriptFile = file;

   setViewMode('log');

   loadJavascriptFile();

   const success = generateTypescript();

   setCodeGenSuccess(success);

   renderHome();
   getWindow().setTitle('kuraTranspiler - ' + file);
}

export function getJavaScriptFile(): string {
   if (state.openMode === 'file') {
      return state.javascriptFile;
   }
   else if (state.folderInfo) {
      return state.folderInfo.javascriptFiles[state.folderInfo.currentFileIndex]
   }
   else {
      throw new Error(`state.folderInfo shouldn't be null`);
   }
}

export function closeJavaScriptFile(): void {
   state.javascriptFile = '';
   state.javascriptCode = '';
   state.typescriptCode = '';
   setViewMode('log');
}

export function setJavascriptCode(code: string): void {
   state.javascriptCode = code;

   renderHome();
}

export function setTypescriptCode(code: string): void {
   state.typescriptCode = code;

   renderHome();
}

export function clearLogs() {
   state.logs = [];
   renderHome();
}
