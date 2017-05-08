import {renderHome} from './home';
import {generateTypescript, getWindow, loadJavascriptFile} from '../global-actions';


export type ViewMode = 'code' | 'log';


export interface State {
   viewMode: ViewMode;
   javascriptFile: string;
   javascriptCode: string;
   typescriptCode: string;
   logs: string[];
}

let state: State = {
   viewMode: 'code',
   javascriptFile: '',
   javascriptCode: '',
   typescriptCode: '',
   logs: []
};

export function getState(): State {
   return state;
}

export function setViewMode(viewMode: ViewMode): void {
   state.viewMode = viewMode;
   renderHome();
}

export function appendLog(log: string): void {
   state.logs.push(log);
   renderHome();
}

export function setJavascriptFile(file: string): void {
   clearLogs();

   state.javascriptFile = file;

   setViewMode('log');

   loadJavascriptFile();
   const success = generateTypescript();

   if (success) {
      setViewMode('code');
   }

   renderHome();
   getWindow().setTitle('kuraTranspiler - ' + file);
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
