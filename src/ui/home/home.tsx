import * as React from "react";
import * as ReactDOM from "react-dom";
import {Editors} from "./editors/editors";
import "./root.less";
import Toolbar from "./toolbar/toolbar";
import Log from "./log/log";
import {getJavaScriptFile2, getState} from "../state/state";
import {ViewMode} from "../state/schema";


export function renderHome() {
   return ReactDOM.render(
      <Home viewMode={getState().viewMode} />,
      document.getElementById("react-entry")
   );
}

interface HomeProps {
   viewMode: ViewMode;
}

class Home extends React.Component<HomeProps, {}> {
   render() {
      return <div className="main-content">
         <Toolbar />
         {this.buildView()}
      </div>;
   }

   buildEditors = () => {
      const s = getState();



      return <Editors javascriptFile={getJavaScriptFile2()}
                      javascriptCode={s.javascriptCode || ''}
                      typescriptCode={s.typescriptCode || ''} />;
   };

   buildView = () => {
      const s = getState();

      switch (this.props.viewMode) {
         case 'code':
            return this.buildEditors();
         case 'log':
            return <Log logs={s.logs} />;
         default:
            return <div />;
      }
   };
}

