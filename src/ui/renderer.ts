import * as fs from 'fs';
import * as path from 'path';

import './home';

console.log('hello world!');
console.log(process.cwd());

const filePath = path.join(process.cwd(), 'test-files', 'simple.js');
const file = fs.readFileSync(filePath);


console.log(file.toString());

