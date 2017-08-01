import * as React from 'react';


export class EditorToolbarLeft extends React.Component<{}, {}> {
   render() {
      return <div className="editorTitle left">JavaScript</div>
   }
}


export class EditorToolbarRight extends React.Component<{}, {}> {
   render() {
      return <div className="editorTitle right">TypeScript</div>
   }
}
