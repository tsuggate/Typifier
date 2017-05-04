import * as React from 'React';
import Button from '../../components/button';
import './toolbar.less';
import {clickOpenJsFile} from '../../globals';
import {setViewMode} from '../state';


export default class Toolbar extends React.Component<{}, {}> {
   render() {
      return <div className="Toolbar">
         <div className="left">
            <Button colour="transparent" onClick={clickOpenJsFile}>Open File</Button>
            <Button colour="transparent" onClick={() => {console.log('yay');}}>Save Conversion</Button>
         </div>
         <div className="right">
            <Button colour="transparent" onClick={this.onClickCompareCode}>Compare Code</Button>
            <Button colour="transparent" onClick={this.onClickShowLog}>Show Log</Button>
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