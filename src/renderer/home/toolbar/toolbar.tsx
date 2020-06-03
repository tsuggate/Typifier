import * as React from 'react';
import Button from '../../components/button';
import './toolbar.css';
import {getWindow, saveTypeScriptCode} from '../../global-actions';
import {dispatch, getJavaScriptFile} from '../../state/state';
import {remote} from 'electron';
import {getJavaScriptFileName, getTypeScriptFileName} from '../../util/util';
import FileNavigation from './file-navigation';
import {ViewMode} from '../../state/schema';


interface ToolbarProps {
   viewMode: ViewMode;
   codeGenSucceeded: boolean;
}

export default class Toolbar extends React.Component<ToolbarProps, {}> {
   render() {
      return <div className="Toolbar">
         <div className="left">
            <Button onClick={this.onClickShowDiff}
                    on={this.props.viewMode === 'diff'}
                    disabled={this.shouldDisableViewCode()}
                    moreClasses="minSize" >Diff</Button>

            <Button onClick={this.onClickCompareCode}
                    on={this.props.viewMode === 'code'}
                    disabled={this.shouldDisableViewCode()}
                    moreClasses="minSize" >Code</Button>

            <Button onClick={this.onClickShowLog}
                    on={this.props.viewMode === 'log'}
                    moreClasses="minSize">Log</Button>
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
      return !this.props.codeGenSucceeded || !getJavaScriptFile();
   };

   onClickShowLog = () => {
      dispatch({type: 'SET_VIEW_MODE', mode: 'log'});
   };

   onClickCompareCode = () => {
      dispatch({type: 'SET_VIEW_MODE', mode: 'code'});
   };

   onClickShowDiff = () => {
      dispatch({type: 'SET_VIEW_MODE', mode: 'diff'});
   };

   onClickApplyChanges = async () => {
      if (!this.shouldDisableApplyChanges()) {
         await saveTypeScriptCode();
      }
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
