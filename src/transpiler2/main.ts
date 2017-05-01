import {app, BrowserWindow} from 'electron';
import * as path from 'path';


let mainWindow: Electron.BrowserWindow | null = null;


function createWindow(): void {
   mainWindow = new BrowserWindow({width: 1200, height: 800});

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
