import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editors} from './editors/editors';
import './root.less';
import Toolbar from './toolbar/toolbar';
import Log from './log/log';
import {getAppState, getCodeState} from '../state/state';
import {ViewMode} from '../state/schema';
import Diff from './diff/diff';


export function renderHome() {
   return ReactDOM.render(
      <Home viewMode={getAppState().viewMode} />,
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
      const s = getCodeState();

      return <Editors javascriptCode={s.javascriptCode || ''}
                      typescriptCode={s.typescriptCode || ''} />;
   };

   buildDiff = () => {
      const s = getCodeState();

      return <Diff javascriptCode={s.javascriptCode || ''}
                   typescriptCode={s.typescriptCode || ''} />;
   };

   buildView = () => {
      const s = getAppState();

      switch (this.props.viewMode) {
         case 'code':
            return this.buildEditors();
         case 'log':
            return <Log logs={s.logs} />;
         default:
            return this.buildDiff();
      }
   };
}

