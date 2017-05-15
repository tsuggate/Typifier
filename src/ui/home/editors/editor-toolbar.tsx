import * as React from 'react';


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
