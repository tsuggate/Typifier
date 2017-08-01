import {dispatch} from '../../state/state';
import * as _ from 'underscore';


export function addLogLn(log: string): void {
   // winston.log('info', log);
   dispatch({type: 'ADD_LOG', log});
}

export function addLog(log: string): void {
   // winston.log('info', log);
   dispatch({type: 'ADD_LOG', log, sameLine: true});
}

export async function logProgress<Output>(description: string, operation: () => Output): Promise<Output> {
   const t1 = _.now();

   // console.log(`before promise ${calcTime(t1)}`);
   const promise = new Promise<Output>(resolve => {
      setTimeout(() => {
         // console.log(`doing operation ${calcTime(t1)}`);
         resolve(operation());
      }, 0);
   });
   // console.log(`after promise ${calcTime(t1)}`);
   addLogLn(description + '...');

   const id = setInterval(() => {
      console.log('setInterval');
      addLog('.');
   }, 100);

   // console.log(`before await ${calcTime(t1)}`);
   const output = await promise;
   // console.log(`after await ${calcTime(t1)}`);
   clearInterval(id);

   addLog(` - ${calcTime(t1)}`);

   return output;
}

export function calcTime(start: number) {
   return `${_.now() - start}ms`;
}

//
// function delay(ms: number): Promise<void> {
//    return new Promise<void>(resolve => {
//       setTimeout(() => {
//          resolve();
//       }, ms);
//    });
// }