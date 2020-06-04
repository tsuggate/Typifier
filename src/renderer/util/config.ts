import * as path from 'path';
const packageJson = require('../../../package.json');

export const appName = packageJson.name;

export function getOsAppDataPath(): string {
  switch (process.platform) {
    case 'win32':
      // E.g. C:\Users\USERNAME\AppData\local
      return process.env.LOCALAPPDATA ?? '';
    case 'darwin':
      return path.join(process.env.HOME ?? '', 'Library', 'Preferences');
    default:
      return path.join(process.env.HOME ?? '', '.local', 'share');
  }
}
