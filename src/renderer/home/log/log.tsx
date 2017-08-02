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
      const logs = this.props.logs.map((log, i) => {
         return this.buildLog(log, i);
      });

      return <div className="logs">{logs}</div>;
   };

   buildLog = (log: string, index: number) => {
      return <div className="single-log" key={index}>{log}</div>;
   };
}
