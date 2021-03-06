import {OpenMode, ViewMode} from "../schema";
import {CloseFile, SetFolder} from "../code-state/code-actions";


export type AppAction = SetViewMode | AddLog | ClearLogs | CloseFile
   | SetFolder | SetOpenMode;


export interface SetViewMode {
   type: 'SET_VIEW_MODE';
   mode: ViewMode;
}

export interface SetOpenMode {
   type: 'SET_OPEN_MODE';
   mode: OpenMode;
}

export interface AddLog {
   type: 'ADD_LOG';
   log: string;
   sameLine?: boolean;
}

export interface ClearLogs {
   type: 'CLEAR_LOGS';
}