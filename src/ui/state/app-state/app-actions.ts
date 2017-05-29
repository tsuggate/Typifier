import {OpenMode, ViewMode} from '../schema';


export type AppAction = SetViewMode | SetOpenMode;


export interface SetViewMode {
   type: 'SET_VIEW_MODE';
   mode: ViewMode;
}

export interface SetOpenMode {
   type: 'SET_OPEN_MODE';
   mode: OpenMode;
}