import {CodeState} from '../schema';
import {CodeActions, SetFileIndex, SetFolder, SetJavaScriptFile, SetTypeScriptCode} from './code-actions';
import {normaliseFileIndex} from "../../util/util";


const initialState: CodeState = {
   codeGenSucceeded: false,
   javascriptFile: null,
   javascriptCode: null,
   typescriptCode: null,
   diffs: null,
   folderPath: null,
   javascriptFiles: [],
   currentFileIndex: 0
};

export function codeReducer(s: CodeState = initialState, action: CodeActions): CodeState {
   switch (action.type) {
      case 'SET_JAVASCRIPT_FILE':
         return setJavaScriptFile(s, action);
      case 'SET_TYPESCRIPT_CODE':
         return setTypeScriptCode(s, action);
      case 'SET_DIFFS':
         return {...s, diffs: action.diffs};
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

function setJavaScriptFile(s: CodeState, action: SetJavaScriptFile): CodeState {
   return {
      ...s,
      javascriptFile: action.file,
      javascriptCode: action.code,
      codeGenSucceeded: false
   };
}

function setTypeScriptCode(s: CodeState, action: SetTypeScriptCode): CodeState {
   return {...s, typescriptCode: action.code, codeGenSucceeded: action.success, diffs: action.diffs};
}

function setFolder(s: CodeState, action: SetFolder): CodeState {
   return {
      ...s,
      folderPath: action.folderPath,
      javascriptFiles: action.javaScriptFiles,
      currentFileIndex: normaliseFileIndex(action.index, action.javaScriptFiles.length),
      codeGenSucceeded: false
   };
}



function setFileIndex(s: CodeState, action: SetFileIndex): CodeState {
   return {
      ...s,
      currentFileIndex: normaliseFileIndex(action.index, s.javascriptFiles.length),
      codeGenSucceeded: false
   };
}

function closeFile(s: CodeState): CodeState {
   return {...s, javascriptFile: null, javascriptCode: null, typescriptCode: null, codeGenSucceeded: false};
}


