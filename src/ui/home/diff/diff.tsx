import * as React from 'react';
import './diff.less';
import {IDiffResult} from 'diff';
import * as _ from 'underscore';


interface DiffProps {
   javascriptCode: string;
   typescriptCode: string;
   diffs: IDiffResult[] | null;
}

export default class Diff extends React.Component<DiffProps, {}> {

   render() {
      return (
         <div className="Diff">
            <div className="pane">
               {this.buildMargin()}

               <div className="codeArea">
                  {this.buildCode(this.props.diffs)}
               </div>
            </div>
         </div>
      );
   }

   buildMargin = () => {
      const {javascriptCode} = this.props;
      const numLines = javascriptCode.split('\n').length;

      const lineNumbers = _.range(numLines).map((n: number) => {
         return <div className={`lineNumber line${n}`} key={n}>{n + 1}</div>
      });

      return <div className="margin">
         {lineNumbers}
      </div>;
   };

   buildCode = (diffs: IDiffResult[] | null) => {
      if (!diffs) {
         return null;
      }

      return diffs.map((d, i) => {
         const value = d.value;

         if (d.added) {
            return <span className='added bubble' key={i}>{value}</span>
         }
         else if (d.removed) {
            return <span className='removed bubble' key={i}>{value}</span>
         }
         else {
            return <span key={i}>{value}</span>
         }
      });
   };

}