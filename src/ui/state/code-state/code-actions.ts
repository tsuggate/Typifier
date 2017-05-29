

export type CodeActions = SetJavaScriptFile | SetTypeScriptCode | SetFolder | SetFileIndex;


export interface SetJavaScriptFile {
   type: 'SET_JAVASCRIPT_FILE';
   file: string;
   code: string;
}

export interface SetTypeScriptCode {
   type: 'SET_TYPESCRIPT_CODE';
   code: string | null;
   success: boolean;
}

export interface SetFolder {
   type: 'SET_FOLDER';
   folderPath: string;
   javaScriptFiles: string[];
}

export interface SetFileIndex {
   type: 'SET_FILE_INDEX';
   index: number;
   javaScriptCode: string;
   typeScriptCode: string;
   success: boolean;
}

