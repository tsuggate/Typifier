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
   else {
      setViewMode('log');
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

   updateEditors();

   getWindow().setTitle('kuraTranspiler - ' + folderPath);
}

function updateEditors(): void {
   const result1 = loadJavascriptFile();

   if (!result1) {
      setViewMode('log');
   }
   else {
      const result2 = generateTypescript();

      setCodeGenSuccess(result2);
      renderHome();
   }
}

export function nextFile(): void {
   const info = state.folderInfo;

   if (!info) {
      return;
   }

   if (info.currentFileIndex < info.javascriptFiles.length - 1) {
      setFileIndex(info.currentFileIndex + 1);
   }
}

export function previousFile(): void {
   const info = state.folderInfo;

   if (!info) {
      return;
   }

   if (info.currentFileIndex > 0) {
      setFileIndex(info.currentFileIndex - 1);
   }
}

function setFileIndex(index: number): void {
   if (state.folderInfo) {
      state.folderInfo.currentFileIndex = index;
      clearLogs();
   }

   updateEditors();
}

export function setJavascriptFile(file: string): void {
   clearLogs();

   state.javascriptFile = file;

   setViewMode('log');

   updateEditors();

   getWindow().setTitle('kuraTranspiler - ' + file);
}

export function getJavaScriptFile(): string {
   if (state.openMode === 'file') {
      return state.javascriptFile;
   }
   else if (state.folderInfo) {
      if (!state.folderInfo.javascriptFiles[state.folderInfo.currentFileIndex]) {
         return '';
      }

      return state.folderInfo.javascriptFiles[state.folderInfo.currentFileIndex]
   }
   else {
      throw new Error(`state.folderInfo shouldn't be null`);
   }
}

export function closeJavaScriptFile(): void {
   console.log('closeJavaScriptFile');
   console.log(state.folderInfo);

   if (state.openMode === 'file') {
      state.javascriptFile = '';
      state.javascriptCode = '';
      state.typescriptCode = '';
      setViewMode('log');
   }
   else {
      if (state.folderInfo && state.folderInfo.javascriptFiles.length > 0) {
         setFolder(state.folderInfo.folderPath);
      }
      else {
         setViewMode('log');
      }
   }
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
