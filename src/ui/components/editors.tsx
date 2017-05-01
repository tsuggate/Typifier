import * as React from 'React';
import AceEditor from 'react-ace';
import * as fs from 'fs';
import * as path from 'path';

import './editors.less'

import 'brace';
import 'brace/mode/java';
import 'brace/theme/github';

let jsCode = '';

try {
   const filePath = path.join(process.cwd(), 'test-files', 'simple.js');
   const file = fs.readFileSync(filePath);
   jsCode = file.toString();
}
catch (e) {
   console.log(e);
}


export class Editors extends React.Component<{}, {}> {
   render() {
      return (
         <div className="Editors">
            <AceEditor
               mode="java"
               theme="github"
               name="editor1"
               width="50%"
               height="100%"
               defaultValue={jsCode}
               onChange={() => {}}
            />
            <AceEditor
               mode="java"
               theme="github"
               width="50%"
               height="100%"
               name="editor2"
               defaultValue="var a = 5;"
               onChange={() => {}}
            />
         </div>
      );
   }
}