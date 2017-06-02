import {renderHome} from '../home/home';
import {AppState, CodeState, State} from './schema';
import {combineReducers, createStore, Store} from 'redux';
import {codeReducer} from './code-state/code-reducer';
import {appReducer} from './app-state/app-reducer';
import {CodeActions} from './code-state/code-actions';
import {AppAction} from './app-state/app-actions';



let store: Store<State> | null = null;

export type KAction = CodeActions | AppAction;

export function initStore() {
   const app = combineReducers<State>({code: codeReducer, app: appReducer});

   store = createStore(app);

   store.subscribe(renderHome);
}

export function getStore(): Store<State> {
   if (!store) {
      throw new Error(`getStore: store doesn't exist.`);
   }
   return store;
}

export function dispatch(action: KAction): void {
   getStore().dispatch(action);
}

export function getState(): State {
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

export function getJavaScriptFile(): string {
   const codeState = getCodeState();
   const appState = getAppState();

   if (appState.openMode === 'file') {
      return codeState.javascriptFile || '';
   }
   else {
      if (!codeState.javascriptFiles[codeState.currentFileIndex]) {
         return '';
      }

      return codeState.javascriptFiles[codeState.currentFileIndex];
   }
}

// export function closeJavaScriptFile(): void {
//    // TODO
//    console.log('closeJavaScriptFile: TODO');
//    console.log('closeJavaScriptFile');
//
//
//    if (state.openMode === 'file') {
//       state.javascriptFile = '';
//       state.javascriptCode = '';
//       state.typescriptCode = '';
//       // setViewMode('log');
//       dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
//    }
//    else {
//       if (state.folderInfo && state.folderInfo.javascriptFiles.length > 0) {
//          openFolder(state.folderInfo.folderPath);
//       }
//       else {
//          // setViewMode('log');
//          dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
//       }
//    }
// }
