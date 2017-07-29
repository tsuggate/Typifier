import {IDiffResult} from 'diff';


export type CodeActions = SetJavaScriptFile | SetTypeScriptCode | SetFolder | SetFileIndex | CloseFile | SetDiffs;


export interface SetJavaScriptFile {
   type: 'SET_JAVASCRIPT_FILE';
   file: string;
   code: string;
}

export interface SetTypeScriptCode {
   type: 'SET_TYPESCRIPT_CODE';
   code: string | null;
   diffs: IDiffResult[] | null;
   success: boolean;
}

export interface SetDiffs {
   type: 'SET_DIFFS';
   diffs: IDiffResult[];
}

export interface SetFolder {
   type: 'SET_FOLDER';
   folderPath: string;
   javaScriptFiles: string[];
   index: number;
}

export interface SetFileIndex {
   type: 'SET_FILE_INDEX';
   index: number;
}

export interface CloseFile {
   type: 'CLOSE_FILE';
}

