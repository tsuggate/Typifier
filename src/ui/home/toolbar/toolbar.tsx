import * as React from 'React';
import Button from '../../components/button';
import './toolbar.less';
import {clickOpenJsFile} from '../../global-actions';
import {getState, setViewMode} from '../state';


export default class Toolbar extends React.Component<{}, {}> {
   render() {
      return <div className="Toolbar">
         <div className="left">
            <Button onClick={clickOpenJsFile}>Open File</Button>
            <Button onClick={() => {console.log('yay');}}>Save Conversion</Button>
         </div>
         <div className="divider"/>
         <div className="right">
            <Button onClick={this.onClickCompareCode} on={getState().viewMode === 'code'} >Show Code</Button>
            <Button onClick={this.onClickShowLog} on={getState().viewMode === 'log'} >Show Log</Button>
         </div>
      </div>;
   }

   onClickShowLog = () => {
      console.log('onClickShowLog');
      setViewMode('log');
   };

   onClickCompareCode = () => {
      setViewMode('code');
   }

}
