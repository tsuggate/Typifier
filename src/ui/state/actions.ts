import {ViewMode} from './schema';


export type KAction = SetViewMode | SetJavaScriptFile | setTypeScriptCode;


export interface SetViewMode {
   type: 'SET_VIEW_MODE';
   mode: ViewMode;
}

export interface SetJavaScriptFile {
   type: 'SET_JAVASCRIPT_FILE';
   file: string;
   code: string;
}

// export interface OpenJavaScriptFile {
//    type: 'OPEN_JAVASCRIPT_FILE';
//    file: string;
// }

export interface setTypeScriptCode {
   type: 'SET_TYPESCRIPT_CODE';
   code: string | null;
   success: boolean;
}

