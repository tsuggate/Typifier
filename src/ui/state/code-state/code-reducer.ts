import {CodeState} from "../schema";
import {CodeActions, SetFileIndex, SetFolder, SetJavaScriptFile} from "./code-actions";


const initialState: CodeState = {
   codeGenSucceeded: false,
   javascriptFile: null,
   javascriptCode: null,
   typescriptCode: null,
   folderPath: null,
   javascriptFiles: [],
   currentFileIndex: 0
};

export function codeReducer(s: CodeState = initialState, action: CodeActions): CodeState {
   switch (action.type) {
      case 'SET_JAVASCRIPT_FILE':
         return setJavaScriptFile(s, action);
      case 'SET_TYPESCRIPT_CODE':
         return {...s, typescriptCode: action.code, codeGenSucceeded: action.success};
      case 'SET_FOLDER':
         return setFolder(s, action);
      case 'SET_FILE_INDEX':
         return setFileIndex(s, action);
      case 'CLOSE_FILE':
         return closeFile(s);
      default:
         return s;
   }
}

export function setJavaScriptFile(s: CodeState, action: SetJavaScriptFile): CodeState {
   return {
      ...s,
      javascriptFile: action.file,
      javascriptCode: action.code
   };
}

function setFolder(s: CodeState, action: SetFolder): CodeState {
   return {
      ...s,
      folderPath: action.folderPath,
      javascriptFiles: action.javaScriptFiles,
      currentFileIndex: normaliseFileIndex(s, action.index, action.javaScriptFiles.length)
   };
}

function normaliseFileIndex(s: CodeState, index: number, numFiles: number): number {
   if (index < 0)
      return 0;
   else if (index >= numFiles)
      return s.javascriptFiles.length - 1;

   return index;
}

function setFileIndex(s: CodeState, action: SetFileIndex): CodeState {
   return {
      ...s,
      currentFileIndex: normaliseFileIndex(s, action.index, s.javascriptFiles.length)
   };
}

function closeFile(s: CodeState): CodeState {
   return {...s, javascriptFile: null, javascriptCode: null, typescriptCode: null, codeGenSucceeded: false};
}


