import {CodeState} from '../schema';
import {CodeActions, SetFileIndex, SetFolder, SetJavaScriptFile} from './code-actions';
import {getAppState} from '../state';


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
      currentFileIndex: 0
   };
}

function setFileIndex(s: CodeState, action: SetFileIndex): CodeState {
   return {
      ...s,
      currentFileIndex: action.index
   };
}

function closeFile(s: CodeState): CodeState {
   if (getAppState().openMode === 'folder') {
      const i = s.currentFileIndex;

      // TODO: Can't put logic here as this will require dispatching.

      return {...s};
   }
   else {
      return {...s, javascriptFile: null, javascriptCode: null, typescriptCode: null, codeGenSucceeded: false};
   }


}


