import * as React from 'react';
import {getState} from '../../state/state';
import {getJavaScriptFileName} from '../../util/util';
import './file-navigation.less';
import Button from '../../components/button';


export default class FileNavigation extends React.Component<{}, {}> {
   render() {
      const s = getState();

      if (s.openMode === 'file') {
         return <div className="FileNavigation">
            <div className="fileTitle">{getJavaScriptFileName()}</div>
         </div>;
      }
      else {
         return <div className="FileNavigation">
            <div className="fileNumber">{this.fileNumberText()}</div>
            <div className="fileTitle">{getJavaScriptFileName()}</div>

            <Button onClick={() => {}}>{'<'}</Button>
            <Button onClick={() => {}}>{'>'}</Button>
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