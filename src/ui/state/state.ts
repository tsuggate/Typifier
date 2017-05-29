import {renderHome} from '../home/home';
import {getWindow, openFolder} from '../global-actions';
import {AppState, CodeState, State, State2} from './schema';
import {getJavaScriptFilesInFolder} from '../util/util';

import {Action, combineReducers, createStore, Store} from 'redux';
import {codeReducer} from './code-state/code-reducer';
import {appReducer} from './app-state/app-reducer';
import {CodeActions} from './code-state/code-actions';
import {AppAction} from './app-state/app-actions';




const state: State = {
   viewMode: 'log',
   openMode: 'file',
   folderInfo: null,
   javascriptFile: null,
   javascriptCode: null,
   typescriptCode: null,
   codeGenSucceeded: false,
   logs: []
};

// const state2: State2 = {
//    app: {
//       viewMode: 'log',
//       openMode: 'file',
//       logs: []
//    },
//    code: {
//       codeGenSucceeded: false,
//       javascriptFile: null,
//       javascriptCode: null,
//       typescriptCode: null,
//       folderPath: null,
//       javascriptFiles: [],
//       currentFileIndex: null
//    }
// };
//
// const initialState = {...state2};


// function app(s: State, action: Action): State {
//    switch (action.type) {
//       case 'SET_VIEW_MODE':
//          return {...s, viewMode: action.mode};
//       case 'SET_JAVASCRIPT_FILE':
//          return setJavaScriptFile2(s, action.file, action.code);
//       case 'SET_TYPESCRIPT_CODE':
//          return {...s, typescriptCode: action.code, codeGenSucceeded: action.success};
//
//       default:
//          return s;
//    }
// }

let store: Store<State2> | null = null;

export type KAction = CodeActions | AppAction;

export function initStore() {
   const app = combineReducers<State2>({code: codeReducer, app: appReducer});

   store = createStore(app);

   console.log(store.getState());
   store.subscribe(renderHome);
}

export function getStore(): Store<State2> {
   if (!store) {
      throw new Error(`getStore: store doesn't exist.`);
   }
   return store;
}

export function dispatch(action: KAction): void {
   getStore().dispatch(action);
}

export function getState(): State2 {
   if (!store) {
      throw new Error(`getState(): store doesn't exist.`);
   }

   return store.getState();
}

export function getAppState(): AppState {
   return getState().app;
}

export function getCodeState(): CodeState {
   return getState().code;
}

// export function setViewMode(viewMode: ViewMode): void {
//    state.viewMode = viewMode;
//    renderHome();
// }

// export function setViewMode(s: State, viewMode: ViewMode) {
//    return {...s, viewMode: viewMode};
// }

// export function setCodeGenSuccess(succeeded: boolean): void {
//    state.codeGenSucceeded = succeeded;
//
//    if (succeeded) {
//       setViewMode('code');
//    }
//    else {
//       setViewMode('log');
//    }
//
//    renderHome();
// }

export function addLog(log: string): void {
   state.logs.push(log);
   renderHome();
}

export function appendLog(log: string): void {
   state.logs[state.logs.length - 1] += log;
   renderHome();
}

// export function setFolder(folderPath: string): void {
//    state.openMode = 'folder';
//
//    state.folderInfo = {
//       folderPath,
//       javascriptFiles: getJavaScriptFilesInFolder(folderPath),
//       currentFileIndex: 0
//    };
//
//    // updateEditors();
//
//    getWindow().setTitle('kuraTranspiler - ' + folderPath);
// }

// function updateEditors(): void {
//    const result1 = loadJavascriptFile();
//
//    if (!result1) {
//       setViewMode('log');
//    }
//    else {
//       const result2 = generateTypescript();
//
//       setCodeGenSuccess(result2);
//       renderHome();
//    }
// }

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

   // updateEditors();
}

// export function setJavascriptFile(file: string): void {
//    clearLogs();
//
//    state.javascriptFile = file;
//    state.openMode = 'file';
//    state.folderInfo = null;
//
//    setViewMode('log');
//
//    updateEditors();
//
//    getWindow().setTitle('kuraTranspiler - ' + file);
// }

// export function getJavaScriptFile(): string {
//    if (state.openMode === 'file') {
//       return state.javascriptFile;
//    }
//    else if (state.folderInfo) {
//       if (!state.folderInfo.javascriptFiles[state.folderInfo.currentFileIndex]) {
//          return '';
//       }
//
//       return state.folderInfo.javascriptFiles[state.folderInfo.currentFileIndex]
//    }
//    else {
//       throw new Error(`state.folderInfo shouldn't be null`);
//    }
// }

export function getJavaScriptFile2(): string {
   const codeState = getCodeState();
   const appState = getAppState();

   if (appState.openMode === 'file') {
      return codeState.javascriptFile || '';
   }
   else {
      if (!codeState.currentFileIndex || !codeState.javascriptFiles[codeState.currentFileIndex]) {
         return '';
      }

      return codeState.javascriptFiles[codeState.currentFileIndex];
   }
   // else {
   //    throw new Error(`state.folderInfo shouldn't be null`);
   // }
}

export function closeJavaScriptFile(): void {
   console.log('closeJavaScriptFile');
   console.log(state.folderInfo);

   if (state.openMode === 'file') {
      state.javascriptFile = '';
      state.javascriptCode = '';
      state.typescriptCode = '';
      // setViewMode('log');
      dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
   }
   else {
      if (state.folderInfo && state.folderInfo.javascriptFiles.length > 0) {
         openFolder(state.folderInfo.folderPath);
      }
      else {
         // setViewMode('log');
         dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
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
