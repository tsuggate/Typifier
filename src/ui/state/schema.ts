

export type ViewMode = 'code' | 'log';
export type OpenMode = 'file' | 'folder';

export interface FolderInfo {
   folderPath: string;
   javascriptFiles: string[];
   currentFileIndex: number; // Use index or fileName?
}

export interface State {
   viewMode: ViewMode;
   openMode: OpenMode;
   folderInfo: FolderInfo | null;
   javascriptFile: string | null;
   javascriptCode: string | null;
   typescriptCode: string | null;
   codeGenSucceeded: boolean;
   logs: string[];
}

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
   currentFileIndex: number | null;
}

export interface State2 {
   app: AppState;
   code: CodeState;
}