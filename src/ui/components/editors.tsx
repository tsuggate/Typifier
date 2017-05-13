import * as React from 'React';
import AceEditor from 'react-ace';
import {getJavaScriptFileName, getTypeScriptFileName} from '../home/util/util';

import './editors.less';

import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/github';


interface EditorsProps {
   javascriptFile: string;
   javascriptCode: string;
   typescriptCode: string;
}

export class Editors extends React.Component<EditorsProps, {}> {
   render() {
      return (
         <div className="Editors">
            <div className="leftEditor">
               <div className="leftTitle">{getJavaScriptFileName()}</div>
               <AceEditor
                  mode="javascript"
                  theme="github"
                  name="editor1"
                  width="100%"
                  height="100%"
                  value={this.props.javascriptCode}
                  readOnly={true}
                  onChange={() => {}}
                  editorProps={{$blockScrolling: 1}}
               />
            </div>
            <div className="rightEditor">
               <div className="rightTitle">{getTypeScriptFileName()}</div>
               <AceEditor
                  mode="javascript"
                  theme="github"
                  width="100%"
                  height="100%"
                  name="editor2"
                  value={this.props.typescriptCode}
                  readOnly={true}
                  onChange={() => {}}
                  editorProps={{$blockScrolling: 1}}
               />
            </div>
         </div>
      );
   }
}