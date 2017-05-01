import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editors} from '../components/editors';
import './root.less';


export function renderHome(): void {
   ReactDOM.render(
      <Editors />,
      document.getElementById("react-entry")
   );
}

