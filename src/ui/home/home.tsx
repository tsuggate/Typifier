import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editors} from '../components/editors';
import './root.less';
import Toolbar from './toolbar/toolbar';
import Log from './log/log';
import {getState, ViewMode} from './state';


export function renderHome(): void {
   ReactDOM.render(
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

      return <Editors javascriptFile={s.javascriptFile}
                      javascriptCode={s.javascriptCode}
                      typescriptCode={s.typescriptCode} />;
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

