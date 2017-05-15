import * as React from 'react';
import Button from '../../components/button';
import './toolbar.less';
import {getWindow, saveTypeScriptCode} from '../../global-actions';
import {getJavaScriptFile, getState, setViewMode} from '../../state/state';
import {remote} from 'electron';
import {getJavaScriptFileName, getTypeScriptFileName} from '../../util/util';
import FileNavigation from './file-navigation';


export default class Toolbar extends React.Component<{}, {}> {
   render() {
      return <div className="Toolbar">

         <div className="left">
            <Button onClick={this.onClickShowLog}
                    on={getState().viewMode === 'log'}
                    moreClasses="minSize">Log</Button>

            <Button onClick={this.onClickCompareCode}
                    on={getState().viewMode === 'code'}
                    disabled={this.shouldDisableViewCode()}
                    moreClasses="minSize" >Code</Button>
         </div>

         <div className="middle">
            <FileNavigation/>
         </div>

         <div className="right">
            <Button onClick={this.onClickApplyChanges}
                    disabled={this.shouldDisableApplyChanges()}
                    moreClasses="applyButton">Apply Changes</Button>

            <Button onClick={this.onClickInfoButton}
                    disabled={this.shouldDisableApplyChanges()}
                    moreClasses="infoButton">ⓘ</Button>
         </div>

      </div>;
   }

   shouldDisableViewCode = () => {
      return !getJavaScriptFile();
   };

   shouldDisableApplyChanges = () => {
      return !getState().codeGenSucceeded || !getJavaScriptFile();
   };

   onClickShowLog = () => {
      setViewMode('log');
   };

   onClickCompareCode = () => {
      setViewMode('code');
   };

   onClickApplyChanges = () => {
      saveTypeScriptCode();
   };

   onClickInfoButton = () => {
      const message = `Applying changes will create "${getTypeScriptFileName()}", and delete`
         + ` "${getJavaScriptFileName()}". \nBe sure to test the changes and fix up any type `
         + `errors before committing!`;

      remote.dialog.showMessageBox(getWindow(), {
         type: 'info',
         title: 'Apply Changes Info',
         message: message
      });
   };
}
