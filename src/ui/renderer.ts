import {renderHome} from './home/home';
import {renderMainWindowMenu} from './home/menu';
import {setJavascriptFile} from "./home/state/state";
import * as path from "path";


renderMainWindowMenu();
renderHome();

// console.log(__dirname);
// setJavascriptFile(path.join(__dirname, '..', 'test-files', 'simple.js'));

