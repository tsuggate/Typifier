import * as React from 'react';
import {getJavaScriptFileName, getTypeScriptFileName} from "../../util/util";


export class EditorToolbarLeft extends React.Component<{}, {}> {
   render() {
      return <div className="leftTitle">JavaScript</div>
   }
}


export class EditorToolbarRight extends React.Component<{}, {}> {
   render() {
      return <div className="rightTitle">TypeScript</div>
   }
}
