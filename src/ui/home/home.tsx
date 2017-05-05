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
      const s = getState();

      const view = this.props.viewMode === 'code' ? this.buildEditors() : <Log logs={s.logs} />;

      return <div className="main-content">
         <Toolbar />
         {view}
      </div>;
   }

   buildEditors = () => {
      const s = getState();

      return <Editors javascriptFile={s.javascriptFile}
                      javascriptCode={s.javascriptCode}
                      typescriptCode={s.typescriptCode} />;
   }
}

