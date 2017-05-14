import * as React from "React";
import Button from "../../components/button";
import "./toolbar.less";
import {clickOpenFolder, clickOpenJsFile, getWindow, saveTypeScriptCode} from "../../global-actions";
import {getState, setViewMode} from "../state/state";
import {remote} from "electron";
import {getJavaScriptFileName, getTypeScriptFileName} from "../util/util";


export default class Toolbar extends React.Component<{}, {}> {
   render() {
      // TODO: Works on mac, test windows: ⓘ

      return <div className="Toolbar">

         <div className="left">
            <Button onClick={clickOpenJsFile}>Open JavaScript File...</Button>
            <Button onClick={clickOpenFolder}>Open Folder...</Button>
         </div>

         <div className="middle">
            <p className="label">View: </p>

            <Button onClick={this.onClickShowLog}
                    on={getState().viewMode === 'log'}
                    moreClasses="logButton" >Log</Button>

            <Button onClick={this.onClickCompareCode}
                    on={getState().viewMode === 'code'}
                    disabled={this.shouldDisableViewCode()}
                    moreClasses="" >Code</Button>
         </div>

         <div className="right">
            <Button onClick={this.onClickSave}
                    disabled={this.shouldDisableApplyChanges()}
                    moreClasses="applyButton">Apply Changes</Button>

            <Button onClick={this.onClickInfoButton}
                    disabled={this.shouldDisableApplyChanges()}
                    moreClasses="infoButton">🛈</Button>
         </div>

      </div>;
   }

   shouldDisableViewCode = () => {
      return !getState().javascriptFile;
   };

   shouldDisableApplyChanges = () => {
      return !getState().codeGenSucceeded || !getState().javascriptFile;
   };

   onClickShowLog = () => {
      setViewMode('log');
   };

   onClickCompareCode = () => {
      setViewMode('code');
   };

   onClickSave = () => {
      console.log('save');

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
