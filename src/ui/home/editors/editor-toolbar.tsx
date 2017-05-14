import * as React from 'react';
import {getJavaScriptFileName, getTypeScriptFileName} from "../../util/util";


export class EditorToolbarLeft extends React.Component<{}, {}> {
   render() {
      return <div className="leftTitle">{getJavaScriptFileName()}</div>
   }
}


export class EditorToolbarRight extends React.Component<{}, {}> {
   render() {
      return <div className="rightTitle">{getTypeScriptFileName()}</div>
   }
}
