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
      const view = this.props.viewMode === 'code' ? <Editors /> : <Log/>;

      return <div className="main-content">
         <Toolbar />
         {view}
      </div>;
   }
}

