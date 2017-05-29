import * as React from 'react';
import {getAppState, getCodeState, getJavaScriptFile2, getState, nextFile, previousFile} from '../../state/state';
import {getJavaScriptFileName} from '../../util/util';
import {shell} from 'electron';
import './file-navigation.less';


export default class FileNavigation extends React.Component<{}, {}> {
   render() {
      // const s = getState();
      const fileName = getJavaScriptFileName();

      if (getAppState().openMode === 'file' || !fileName) {
         return <div className="FileNavigation">
            <div className="fileTitle center" onClick={this.openFileLocation}>{fileName}</div>
         </div>;
      }
      else {
         return <div className="FileNavigation">
            <div className="fileTitle" onClick={this.openFileLocation}>{fileName}</div>

            <div className="controls">
               <div className="fileNumber">{this.fileNumberText()}</div>
               <div className="arrows">
                  {this.makePreviousButton()}
                  {this.makeNextButton()}
               </div>
            </div>
         </div>;
      }
   }

   makeNextButton = () => {
      let classes = ['nextFile'];

      if (this.nextDisabled()) {
         classes.push('disabled');
      }

      return (
         <div className={classes.join(' ')} onClick={nextFile} >
            <div className="arrowRight"/>
         </div>
      );
   };

   nextDisabled = () => {
      const codeState = getCodeState();

      return codeState.currentFileIndex === codeState.javascriptFiles.length - 1;
   };

   makePreviousButton = () => {
      let classes = ['previousFile'];

      if (this.previousDisabled()) {
         classes.push('disabled');
      }

      return (
         <div className={classes.join(' ')} onClick={previousFile} >
            <div className="arrowLeft"/>
         </div>
      );
   };

   previousDisabled = () => {
      return getCodeState().currentFileIndex === 0;
   };

   fileNumberText = () => {
      const s = getCodeState();

      if (s.currentFileIndex) {
         const num = s.currentFileIndex + 1;
         const total = s.javascriptFiles.length;

         return `${num} of ${total}`;
      }
      return '';
   };

   openFileLocation = () => {
      const filePath = getJavaScriptFile2();

      shell.showItemInFolder(filePath);
   }
}