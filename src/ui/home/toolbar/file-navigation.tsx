import * as React from 'react';
import {getState, nextFile, previousFile} from '../../state/state';
import {getJavaScriptFileName} from '../../util/util';
import './file-navigation.less';



export default class FileNavigation extends React.Component<{}, {}> {
   render() {
      const s = getState();
      const fileName = getJavaScriptFileName();

      if (s.openMode === 'file' || !fileName) {
         return <div className="FileNavigation">
            <div className="fileTitle center">{fileName}</div>
         </div>;
      }
      else {
         return <div className="FileNavigation">
            <div className="fileTitle">{fileName}</div>

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
      const folderInfo = getState().folderInfo;

      return !!(folderInfo && folderInfo.currentFileIndex === folderInfo.javascriptFiles.length - 1);
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
      const folderInfo = getState().folderInfo;

      return !!(folderInfo && folderInfo.currentFileIndex === 0);
   };

   fileNumberText = () => {
      const s = getState();

      if (s.folderInfo) {
         const num = s.folderInfo.currentFileIndex + 1;
         const total = s.folderInfo.javascriptFiles.length;

         return `${num} of ${total}`;
      }
      return '';
   };
}