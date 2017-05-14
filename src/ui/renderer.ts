import {renderHome} from './home/home';
import {renderMainWindowMenu} from './home/menu';
import {setJavascriptFile} from "./state/state";
import * as path from "path";


renderMainWindowMenu();
renderHome();


setJavascriptFile(path.join(__dirname, '..', 'test-files', 'simple.js'));

