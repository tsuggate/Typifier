import * as React from 'react';
import './diff.less';
import * as diff from 'diff';
import {IDiffResult} from 'diff';
import * as _ from 'underscore';


interface DiffProps {
   javascriptCode: string;
   typescriptCode: string;
}

export default class Diff extends React.Component<DiffProps, {}> {

   render() {
      const diffs = this.buildDiffs();

      return (
         <div className="Diff">

            {this.buildMargin()}

            <div className="codeArea">
               {this.buildCode(diffs)}
            </div>

         </div>
      );
   }

   buildDiffs = () => {
      const {javascriptCode, typescriptCode} = this.props;

      const t1 = _.now();

      const diffs = diff.diffWords(javascriptCode, typescriptCode);

      const t2 = _.now();

      console.log(`took: ${t2 - t1}ms`);

      return diffs;
   };

   buildMargin = () => {
      const {javascriptCode} = this.props;
      const numLines = javascriptCode.split('\n').length;

      const lineNumbers = _.range(numLines).map((n, i) => {
         return <div className="lineNumber" key={i}>{n + 1}</div>
      });

      return <div className="margin">
         {lineNumbers}
      </div>;
   };

   buildCode = (diffs: IDiffResult[]) => {
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