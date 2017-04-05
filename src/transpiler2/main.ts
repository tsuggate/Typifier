import * as path from 'path';
import {parseAndLog} from './parser';


const jsPath = path.resolve('test-files', 'simple.js');
const jsPath2 = path.resolve('..', 'client', 'src', 'instance', 'js', 'plugins', 'image-annotation', 'main.js');


parseAndLog(jsPath);

