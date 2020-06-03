import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editors} from './editors/editors';
import './root.css';
import Toolbar from './toolbar/toolbar';
import Log from './log/log';
import {getState, getStore} from '../state/state';
import {State} from '../state/schema';
import Diff from './diff/diff';
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import {ComponentClass} from "react";

export function renderHome() {
   return ReactDOM.render(
      <Provider store={getStore()}>
         <HomeView state={getState()} />
      </Provider>,
      document.getElementById("react-entry")
   );
}

interface HomeProps {
   state: State;
}

const mapStateToProps = (state: State, homeProps: HomeProps) => ({
   state: state
});


class Home extends React.Component<HomeProps, {}> {
   render() {

      return <div className="main-content">
         <Toolbar viewMode={this.props.state.app.viewMode}
                  codeGenSucceeded={this.props.state.code.codeGenSucceeded} />
         {this.buildView()}
      </div>;
   }

   buildEditors = () => {
      const s = this.props.state.code;

      return <Editors javascriptCode={s.javascriptCode || ''}
                      typescriptCode={s.typescriptCode || ''} />;
   };

   buildDiff = () => {
      const s = this.props.state.code;

      return <Diff javascriptCode={s.javascriptCode || ''}
                   typescriptCode={s.typescriptCode || ''}
                   diffs={s.diffs} />;
   };

   buildView = () => {
      const s = this.props.state.app;

      switch (s.viewMode) {
         case 'code':
            return this.buildEditors();
         case 'log':
            return <Log logs={s.logs} />;
         default:
            return this.buildDiff();
      }
   };
}

export const HomeView: ComponentClass<HomeProps> = connect(
   mapStateToProps, {}
)(Home);

// const App = () => (
//    <div>
//       <HomeView />
//    </div>
// );
