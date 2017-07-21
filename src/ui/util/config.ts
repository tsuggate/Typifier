const packageJson = require('../../../package.json');


export const appName = packageJson.name;

export function getOsAppDataPath(): string {

   // E.g. C:\Users\USERNAME\AppData\local
   return process.env.LOCALAPPDATA;
}
