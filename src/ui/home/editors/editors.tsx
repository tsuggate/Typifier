import * as React from 'react';
import AceEditor from 'react-ace';
import {EditorToolbarLeft, EditorToolbarRight} from './editor-toolbar';

import './editors.less';

import 'brace';
import 'brace/mode/javascript';
import 'brace/mode/typescript';
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
               <EditorToolbarLeft />
               <AceEditor
                  mode="typescript"
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
               <EditorToolbarRight />
               <AceEditor
                  mode="typescript"
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