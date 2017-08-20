import {remote} from 'electron';
import {getWindow} from '../global-actions';
import {appName} from './config';
const packageJson = require('../../../package.json');


async function requestRemotePackageJson() {
   try {
      const res = await fetch(`https://raw.githubusercontent.com/tsuggate/Typifier/master/package.json`);

      return await res.json();
   }
   catch (e) {
      console.log(e);

      return null;
   }
}

type VersionArray = [number, number, number];

export async function checkForNewVersion() {
   const remoteJson = await requestRemotePackageJson();

   if (remoteJson && remoteJson.version) {
      const remoteVersion = remoteJson.version.split('.').map((n: string) => parseInt(n)) as VersionArray;
      const thisVersion = packageJson.version.split('.').map((n: string) => parseInt(n)) as VersionArray;

      console.log(`This version: ${packageJson.version}, remote version: ${remoteJson.version}`);

      if (thisVersion[0] < remoteVersion[0] || thisVersion[1] < remoteVersion[1] || thisVersion[2] < remoteVersion[2]) {
         remote.dialog.showMessageBox(getWindow(), {
            type: 'info',
            title: `New Version Available`,
            message: `There is a new version of ${appName} available. You should download it from TeamCity before continuing.`
         });
      }
   }
}