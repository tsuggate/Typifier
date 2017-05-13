import {renderHome} from './home/home';
import {renderMainWindowMenu} from './home/menu';
import * as path from 'path';
import {setJavascriptFile} from './home/state';


renderMainWindowMenu();
renderHome();



// const simpleCode = path.join(__dirname, '..', 'test-files', 'simple.js');
// setJavascriptFile(simpleCode);