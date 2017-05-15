import {remote} from 'electron';
import {clickOpenFolder, clickOpenJsFile, getWindow} from '../global-actions';
import {platform} from "os";


type MenuItemOptions = Electron.MenuItemOptions;


function buildViewMenu() {
   return {
      label: 'View',
      submenu: [
         {role: 'reload'},
         {role: 'forcereload'},
         {role: 'toggledevtools'},
         {type: 'separator'},
         {role: 'resetzoom'},
         {role: 'zoomin'},
         {role: 'zoomout'},
         {type: 'separator'},
         {role: 'togglefullscreen'}
      ] as MenuItemOptions[]
   };
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

   // if (process.platform === 'darwin') {
   fileMenuItems.push({role: 'quit'});
   // }
   // else {
   //    fileMenuItems.push({
   //       label: 'Exit',
   //       click: () => {
   //          getWindow().close();
   //       }
   //    });
   // }

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
      buildViewMenu()
      // buildDevMenu(getWindow())
   ];

   if (platform() === 'darwin') {
      remote.Menu.setApplicationMenu(remote.Menu.buildFromTemplate(menu));
   }
   else {
      getWindow().setMenu(remote.Menu.buildFromTemplate(menu));
   }
}