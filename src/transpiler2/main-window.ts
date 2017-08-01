import {app, BrowserWindow} from 'electron';
import * as path from 'path';
import {devMode, openFileArg, parseArgs} from './util/args';
import * as winston from 'winston';
import {appName, getOsAppDataPath} from '../ui/util/config';
import * as fs from 'fs-extra';

const windowState = require('electron-window-state');


let mainWindow: Electron.BrowserWindow | null = null;


function createWindow(): void {
   const mainWindowState = windowState({
      defaultWidth: 1200,
      defaultHeight: 800
   });

   mainWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      minWidth: 800,
      minHeight: 600
   });

   const htmlPath = `file://${path.join(__dirname, '..', 'resources', 'index.html')}`;
   mainWindow.loadURL(htmlPath);

   if (devMode) {
      mainWindow.webContents.openDevTools();
   }

   mainWindow.on('closed', () => {
      mainWindow = null
   });

   mainWindowState.manage(mainWindow);

   const logPath = path.join(getOsAppDataPath(), appName, `log#${+new Date()}.json`);
   fs.ensureFileSync(logPath);

   winston.add(winston.transports.File, { filename: logPath });

   winston.log('info', process.argv.toString());
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
      app.quit();
   }
});

app.on('activate', () => {
   if (mainWindow === null) {
      createWindow();
   }
});

preventMultipleAppInstances();


function preventMultipleAppInstances() {
   const shouldQuit = app.makeSingleInstance((args: string[], workingDirectory: string) => {
      if (mainWindow) {
         if (mainWindow.isMinimized()) {
            mainWindow.restore();
         }
         mainWindow.focus();
      }

      parseArgs(args, (() => {
         if (openFileArg) {
            // The second instance was going to open a file, so we should open
            // that file in this instance.
            const filePath = path.resolve(workingDirectory, openFileArg);

            if (mainWindow && mainWindow.webContents) {
               mainWindow.webContents.send('openFile', filePath);
            }
         }
      }));

      return true;
   });

   if (shouldQuit) {
      app.quit();
      return;
   }
}
