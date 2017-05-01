import {app, BrowserWindow} from 'electron';
import * as path from 'path';


let mainWindow: Electron.BrowserWindow | null = null;


function createWindow(): void {
   mainWindow = new BrowserWindow({width: 1200, height: 800});

   console.log('__dirname: ', __dirname);

   mainWindow.loadURL(`file://${path.join(process.cwd(), 'resources', 'index.html')}`);

   mainWindow.webContents.openDevTools();

   mainWindow.on('closed', () => {
      mainWindow = null
   });
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



// const {app, BrowserWindow} = require('electron')
// const url = require('url')
// const path = require('path')
//
// let win;
//
// console.log(path.join(process.cwd(), 'resources', 'index.html'));
//
// function createWindow() {
//    win = new BrowserWindow({width: 800, height: 600});
//
//    win.loadURL(url.format({
//       pathname: path.join(process.cwd(), 'resources', 'index.html'),
//       protocol: 'file:',
//       slashes: true
//    }));
// }
//
// app.on('ready', createWindow);