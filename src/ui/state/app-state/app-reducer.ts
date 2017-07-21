import {AppState} from "../schema";
import {AddLog, AppAction} from "./app-actions";
import * as _ from "underscore";


const initialState: AppState = {
   viewMode: 'log',
   openMode: 'file',
   logs: []
};

export function appReducer(s: AppState = initialState, action: AppAction): AppState {
   switch (action.type) {
      case 'SET_VIEW_MODE':
         return {...s, viewMode: action.mode};
      case 'SET_FOLDER':
         return {...s, openMode: 'folder'};
      case 'SET_OPEN_MODE':
         return {...s, openMode: 'file'};
      case 'ADD_LOG':
         return addLog(s, action);
      case 'CLEAR_LOGS':
         return {...s, logs: []};
      case 'CLOSE_FILE':
         return {...s, viewMode: 'log'};

      default:
         return s;
   }
}


function addLog(s: AppState, action: AddLog): AppState {
   if (action.sameLine && s.logs.length > 0) {
      const i = s.logs.length - 1;
      const lastLog = s.logs[i];

      return {...s, logs: [..._.initial(s.logs), lastLog + action.log]};
   }

   return {...s, logs: [...s.logs, action.log]};
}
