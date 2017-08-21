import {remote} from 'electron';
import {getWindow} from '../global-actions';
import {appName} from './config';
const packageJson = require('../../../package.json');


async function requestRemotePackageJson(): Promise<Record<string, any> | null> {
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

export async function getVersionRemote(): Promise<string | null> {
   const remoteJson = await requestRemotePackageJson();

   if (remoteJson && remoteJson.version) {
      return remoteJson.version;
   }

   return null;
}

export async function checkForNewVersion(): Promise<void> {
   const remoteVersionString = await getVersionRemote();

   if (remoteVersionString) {
      const remoteVersion = remoteVersionString.split('.').map(parseFloat) as VersionArray;
      const thisVersion = packageJson.version.split('.').map(parseFloat) as VersionArray;

      console.log(`This version: ${packageJson.version}, remote version: ${remoteVersionString}`);

      if (thisVersion[0] < remoteVersion[0] || thisVersion[1] < remoteVersion[1] || thisVersion[2] < remoteVersion[2]) {
         remote.dialog.showMessageBox(getWindow(), {
            type: 'info',
            title: `New Version Available`,
            message: `There is a new version of ${appName} available. You should download it from TeamCity before continuing.`
         });
      }
   }

   setTimeout(checkForNewVersion, 1000 * 60 * 60);
}
