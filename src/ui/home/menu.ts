import {remote} from 'electron';
import {clickOpenJsFile, getWindow} from '../globals';


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

   const fileMenuItems: MenuItemOptions[] = [
      {
         label: 'Open Javascript File...',
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

   getWindow().setMenu(remote.Menu.buildFromTemplate(menu));
}