import * as React from 'React';
import AceEditor from 'react-ace';

import './editors.less';

import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/github';
import {getTsOutput, loadJsFile} from '../../data/data';



export class Editors extends React.Component<{}, {}> {
   render() {
      return (
         <div className="Editors">
            <AceEditor
               mode="javascript"
               theme="github"
               name="editor1"
               width="50%"
               height="100%"
               value={loadJsFile()}
               readOnly={true}
               onChange={() => {}}
            />
            <AceEditor
               mode="javascript"
               theme="github"
               width="50%"
               height="100%"
               name="editor2"
               value={getTsOutput()}
               readOnly={true}
               onChange={() => {}}
            />
         </div>
      );
   }
}