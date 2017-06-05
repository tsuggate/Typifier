

export type ViewMode = 'code' | 'diff' | 'log';
export type OpenMode = 'file' | 'folder';


export interface AppState {
   viewMode: ViewMode;
   openMode: OpenMode;
   logs: string[];
}

export interface CodeState {
   codeGenSucceeded: boolean;

   javascriptFile: string | null;
   javascriptCode: string | null;
   typescriptCode: string | null;

   folderPath: string | null;
   javascriptFiles: string[];
   currentFileIndex: number;
}

export interface State {
   app: AppState;
   code: CodeState;
}