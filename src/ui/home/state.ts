import {renderHome} from './home';
import {generateTypescript, getWindow, loadJavascriptFile} from '../global-actions';


export type ViewMode = 'code' | 'log';


export interface State {
   viewMode: ViewMode;
   javascriptFile: string;
   javascriptCode: string;
   typescriptCode: string;
   codeGenSucceeded: boolean;
   logs: string[];
}

let state: State = {
   viewMode: 'log',
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
