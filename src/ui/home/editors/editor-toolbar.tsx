import * as React from 'react';
import {getJavaScriptFileName} from "../../util/util";


export class EditorToolbar extends React.Component<{}, {}> {
   render() {
      return <div className="leftTitle">{getJavaScriptFileName()}</div>
   }
}
