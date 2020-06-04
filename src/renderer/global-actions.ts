import {remote} from 'electron';
import {dispatch, getAppState, getCodeState, getJavaScriptFile} from './state/state';
import * as fs from 'fs';
import {transpile} from './transpiler-main';
import {getJavaScriptFilesInFolder, getTypeScriptFilePath, normaliseFileIndex} from './util/util';
import * as diff from 'diff';
import * as _ from 'underscore';
import {addLogLn, logProgress} from './home/log/logger';
import {Change} from 'diff';

const packageJson = require('../../package.json');

export function getWindow(): Electron.BrowserWindow {
  return remote.getCurrentWindow();
}

export async function clickOpenJsFile(): Promise<void> {
  const filePath = await showOpenJsFileWindow();

  if (filePath) {
    await openFile(filePath);
  }
}

async function showOpenJsFileWindow(): Promise<string | null> {
  const {filePaths, canceled} = await remote.dialog.showOpenDialog(getWindow(), {
    properties: ['openFile'],
    filters: [{name: 'javascript', extensions: ['js']}],
  });

  if (!canceled && filePaths.length > 0) {
    return filePaths[0];
  }
  return null;
}

export async function clickOpenFolder(): Promise<void> {
  const folderPath = await showOpenFolderWindow();

  if (folderPath) {
    await openFolder(folderPath);
  }
}

export async function showOpenFolderWindow(): Promise<string | null> {
  const {filePaths, canceled} = await remote.dialog.showOpenDialog(getWindow(), {
    properties: ['openDirectory'],
  });

  if (!canceled && filePaths.length > 0) {
    return filePaths[0];
  }

  return null;
}

export async function openFile(file: string): Promise<void> {
  dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
  dispatch({type: 'SET_OPEN_MODE', mode: 'file'});

  getWindow().setTitle(`${packageJson.name} - ${file}`);

  await generateTypeScript(file);
}

export async function openFolder(folderPath: string, indexIn: number = 0): Promise<void> {
  dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
  getWindow().setTitle(`${packageJson.name} - ${folderPath}`);

  const files = getJavaScriptFilesInFolder(folderPath);

  const index = normaliseFileIndex(indexIn, files.length);

  dispatch({type: 'SET_FOLDER', folderPath, javaScriptFiles: files, index: index});

  if (files[index]) {
    await generateTypeScript(files[index]);
  }
}

async function generateTypeScript(javaScriptFile: string): Promise<void> {
  const code = await loadJavaScriptFile(javaScriptFile);

  if (code) {
    dispatch({type: 'SET_JAVASCRIPT_FILE', file: javaScriptFile, code});

    const t1 = _.now();

    const output = await transpile(code, {language: 'typescript'});

    if (output.success) {
      // const diffs = await generateDiffs(code, output.code);

      dispatch({
        type: 'SET_TYPESCRIPT_CODE',
        code: output.code,
        success: output.success,
        diffs: null,
      });
      dispatch({type: 'SET_VIEW_MODE', mode: 'code'});
    } else {
      // let diffs;

      // if (output.javascriptOutput && !output.javascriptOutput.matches) {
      // diffs = await generateDiffs(output.javascriptOutput.escodegen, output.javascriptOutput.generated);
      // }
      dispatch({
        type: 'SET_TYPESCRIPT_CODE',
        code: output.code,
        success: output.success,
        diffs: null,
      });
      dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
    }

    addLogLn(`Total Time: ${_.now() - t1}ms`);
  }
}

export function generateDiffs(javaScript: string, typeScript: string): Promise<Change[]> {
  return logProgress('Generating diffs', () => diff.diffWords(javaScript, typeScript));
}

export async function saveTypeScriptCode(): Promise<void> {
  const codeState = getCodeState();

  const jsFile = getJavaScriptFile();
  const tsFile = getTypeScriptFilePath();
  const code = codeState.typescriptCode;

  fs.writeFileSync(tsFile, code);

  fs.unlinkSync(jsFile);
  addLogLn(`Wrote ${tsFile}`);

  dispatch({type: 'CLOSE_FILE'});

  if (getAppState().openMode !== 'file' && codeState.folderPath) {
    await openFolder(codeState.folderPath, codeState.currentFileIndex);
  }
}

export async function nextFile(): Promise<void> {
  const s = getCodeState();

  if (s.currentFileIndex < s.javascriptFiles.length - 1) {
    await setFileIndex(s.currentFileIndex + 1);
  }
}

export async function previousFile(): Promise<void> {
  const s = getCodeState();

  if (s.currentFileIndex > 0) {
    await setFileIndex(s.currentFileIndex - 1);
  }
}

async function setFileIndex(index: number): Promise<void> {
  dispatch({type: 'CLEAR_LOGS'});
  dispatch({type: 'SET_VIEW_MODE', mode: 'log'});

  const s = getCodeState();
  const jsFile = s.javascriptFiles[index];

  dispatch({type: 'SET_FILE_INDEX', index});
  await generateTypeScript(jsFile);
}

export async function loadJavaScriptFile(jsFile: string): Promise<string | null> {
  if (!jsFile) {
    return null;
  }

  return await readFile(jsFile);
}

function readFile(file: string): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    fs.readFile(file, (e, data) => {
      if (e) {
        console.log(e);
        addLogLn(`${e.stack ? e.stack : e}`);
        resolve(null);
      } else {
        resolve(data.toString());
      }
    });
  });
}
