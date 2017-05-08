import {app, BrowserWindow} from 'electron';
import * as path from 'path';
import * as windowState from 'electron-window-state';


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
      height: mainWindowState.height
   });

   mainWindow.loadURL(`file://${path.join(process.cwd(), 'resources', 'index.html')}`);

   mainWindow.webContents.openDevTools();

   mainWindow.on('closed', () => {
      mainWindow = null
   });

   mainWindow.setMenu(null);
   mainWindowState.manage(mainWindow);
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
