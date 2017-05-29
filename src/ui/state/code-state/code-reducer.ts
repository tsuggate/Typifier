import {CodeState} from '../schema';
import {CodeActions, SetFileIndex, SetFolder} from './code-actions';
import {loadJavaScriptFile2} from '../../global-actions';
import {transpile} from '../../../transpiler2/transpiler-main';


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
         return setJavaScriptFile2(s, action.file, action.code);
      case 'SET_TYPESCRIPT_CODE':
         return {...s, typescriptCode: action.code, codeGenSucceeded: action.success};
      case 'SET_FOLDER':
         return setFolder(s, action);
      case 'SET_FILE_INDEX':
         return setFileIndex(s, action);
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


function setFileIndex(s: CodeState, action: SetFileIndex): CodeState {
   return {
      ...s,
      currentFileIndex: action.index,
      javascriptCode: action.javaScriptCode,
      typescriptCode: action.typeScriptCode,
      codeGenSucceeded: action.success
   };
}