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
            <div className="fileTitle">{getJavaScriptFileName()}</div>
         </div>;
      }
      else {
         return <div className="FileNavigation">
            <div className="fileNumber">{this.fileNumberText()}</div>
            <div className="fileTitle">{getJavaScriptFileName()}</div>

            <div className="arrows">
               <div className="previousFile" onClick={previousFile} >
                  <div className="arrowLeft"/>
               </div>

               <div className="nextFile" onClick={nextFile} >
                  <div className="arrowRight"/>
               </div>
            </div>
         </div>;
      }
   }

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