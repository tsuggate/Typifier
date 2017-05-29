import {CodeState} from '../schema';
import {CodeActions, SetFolder} from './code-actions';


const initialState: CodeState = {
   codeGenSucceeded: false,
   javascriptFile: null,
   javascriptCode: null,
   typescriptCode: null,
   folderPath: null,
   javascriptFiles: [],
   currentFileIndex: null
};

export function codeReducer(s: CodeState = initialState, action: CodeActions): CodeState {
   switch (action.type) {
      case 'SET_JAVASCRIPT_FILE':
         return setJavaScriptFile2(s, action.file, action.code);
      case 'SET_TYPESCRIPT_CODE':
         return {...s, typescriptCode: action.code, codeGenSucceeded: action.success};
      case 'SET_FOLDER':
         return setFolder(s, action);
      default:
         return s;
   }
}

export function setJavaScriptFile2(s: CodeState, file: string, code: string): CodeState {
   return {
      ...s,
      javascriptFile: file,
      javascriptCode: code
   };
}

function setFolder(s: CodeState, action: SetFolder): CodeState {
   return {
      ...s,
      folderPath: action.folderPath,
      javascriptFiles: action.javaScriptFiles,
      currentFileIndex: 0
   };
}