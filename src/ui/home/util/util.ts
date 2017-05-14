import {getState} from '../state/state';
import * as path from 'path';


export function getTypeScriptFileName(): string {
   const jsFile = getState().javascriptFile;

   return path.parse(jsFile).name + '.ts';
}

export function getJavaScriptFileName(): string {
   const jsFile = getState().javascriptFile;

   return path.parse(jsFile).name + '.js';
}

export function getTypeScriptFilePath(): string {
   const jsFile = getState().javascriptFile;

   return jsFile.split('.')[0] + '.ts';
}

export function getJavaScriptFilesInFolder(folderPath: string): string[] {

   return [];
}