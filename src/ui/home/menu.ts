import {remote} from 'electron';
import {clickOpenJsFile, getWindow} from '../globals';


type MenuItem = Electron.MenuItemOptions;


export function renderMainWindowMenu(): void {
   const separator: MenuItem = {
      type: 'separator'
   };

   const fileMenuItems: MenuItem[] =
      [
         {
            label: 'Open Javascript File',
            click: clickOpenJsFile,
            accelerator: 'CmdOrCtrl+O',
            enabled: true
         },
         separator,
         {
            label: 'Exit',
            click: () => {
               getWindow().close();
            }
         }
      ];

   const fileMenu = {
      label: 'File',
      submenu: fileMenuItems
   };

   let menu: MenuItem[] = [
      fileMenu
   ];

   // if (!config.productionMode) {
      menu.push(buildDevMenu(getWindow()));
   // }

   getWindow().setMenu(remote.Menu.buildFromTemplate(menu));
}

export function buildDevMenu(window: Electron.BrowserWindow): MenuItem {

   let devMenuItems: MenuItem[] = [
      {
         label: 'Refresh Page',
         click: () => window.reload(),
         accelerator: 'F5'
      },
      {
         label: 'Show Dev Tools',
         click: () => {
            if (window.webContents.isDevToolsOpened())
               window.webContents.closeDevTools();
            else
               window.webContents.openDevTools();
         },
         accelerator: 'CmdOrCtrl+Shift+I'
      }
   ];

   return {
      label: 'Dev',
      submenu: devMenuItems
   };
}