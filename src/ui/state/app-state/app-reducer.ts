import {AppState} from '../schema';
import {AppAction} from './app-actions';


const initialState: AppState = {
   viewMode: 'log',
   openMode: 'file',
   logs: []
};

export function appReducer(s: AppState = initialState, action: AppAction): AppState {
   switch (action.type) {
      case 'SET_VIEW_MODE':
         return {...s, viewMode: action.mode};
      case 'SET_OPEN_MODE':
         return {...s, openMode: 'folder'};

      default:
         return s;
   }
}