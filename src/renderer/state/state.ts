import {renderHome} from '../home/home';
import {AppState, CodeState, State} from './schema';
import {applyMiddleware, combineReducers, createStore, Store} from 'redux'
import {codeReducer} from './code-state/code-reducer';
import {appReducer} from './app-state/app-reducer';
import {CodeActions} from './code-state/code-actions';
import {AppAction} from './app-state/app-actions';
import {actionToPlainObject} from '../util/custom-middleware'



let store: Store<State> | null = null;

export type KAction = CodeActions | AppAction;

export function initStore() {
   const app = combineReducers<State>({code: codeReducer, app: appReducer});

   store = createStore(
      app,
      applyMiddleware(actionToPlainObject)
   );

   // store.subscribe(renderHome);
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
   const codeState = getState().code;
   const appState = getState().app;

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
