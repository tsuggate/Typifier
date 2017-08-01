import {remote} from 'electron';
import {clickOpenFolder, clickOpenJsFile, getWindow} from '../global-actions';
import {platform} from "os";
const packageJson = require('../../../package.json');


type MenuItemOptions = Electron.MenuItemConstructorOptions;


function buildViewMenu() {
   return {
      label: 'View',
      submenu: [
         {role: 'reload'},
         // {role: 'forcereload'},
         {role: 'toggledevtools'},
         {type: 'separator'},
         {role: 'resetzoom'},
         {role: 'zoomin'},
         {role: 'zoomout'},
         // {type: 'separator'},
         // {role: 'togglefullscreen'}
      ] as MenuItemOptions[]
   };
}

function buildHelpMenu() {
   return {
      label: 'Help',
      submenu: [{
         label: 'About',
         click: () => {
            remote.dialog.showMessageBox(getWindow(), {
               type: 'info',
               title: 'Kura Transpiler',
               message: `Kura Transpiler`,
               detail: `Version ${packageJson.version}`
            });
         }
      }]
   }
}

export function renderMainWindowMenu(): void {
   const separator: MenuItemOptions = {
      type: 'separator'
   };

   let fileMenuItems: MenuItemOptions[] = [
      {
         label: 'Open Javascript File...',
         click: clickOpenJsFile,
         accelerator: 'CmdOrCtrl+O',
         enabled: true
      },
      {
         label: 'Open Folder...',
         click: clickOpenFolder,
         accelerator: 'CmdOrCtrl+Shift+O',
         enabled: true
      },
      separator
   ];

   fileMenuItems.push({role: 'quit'});

   const fileMenu = {
      label: 'File',
      submenu: fileMenuItems
   };

   const editMenuItems: MenuItemOptions[] = [
      {role: 'copy'},
      {role: 'selectall'}
   ];

   const editMenu = {
      label: 'Edit',
      submenu: editMenuItems
   };

   let menu: MenuItemOptions[] = [
      fileMenu,
      editMenu,
      buildViewMenu(),
      buildHelpMenu()
   ];

   if (platform() === 'darwin') {
      remote.Menu.setApplicationMenu(remote.Menu.buildFromTemplate(menu));
   }
   else {
      getWindow().setMenu(remote.Menu.buildFromTemplate(menu));
   }
}