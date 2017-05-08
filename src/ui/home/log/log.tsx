import * as React from 'react';
import './log.less';

interface LogProps {
   logs: string[];
}

export default class Log extends React.Component<LogProps, {}> {
   render() {
      return <div className="Log">
         {this.buildLogs()}
      </div>;
   }

   buildLogs = () => {
      const logs = this.props.logs.map((l, i) => {
         return <div className="single-log" key={i}>{l}</div>;
      });

      return <div className="logs">{logs}</div>;
   };
}
