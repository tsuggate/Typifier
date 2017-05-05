import * as React from 'React';
import AceEditor from 'react-ace';

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
            <AceEditor
               mode="javascript"
               theme="github"
               name="editor1"
               width="50%"
               height="100%"
               value={this.props.javascriptCode}
               readOnly={true}
               onChange={() => {}}
               editorProps={{$blockScrolling: 1}}
            />
            <AceEditor
               mode="javascript"
               theme="github"
               width="50%"
               height="100%"
               name="editor2"
               value={this.props.typescriptCode}
               readOnly={true}
               onChange={() => {}}
               editorProps={{$blockScrolling: 1}}
            />
         </div>
      );
   }
}