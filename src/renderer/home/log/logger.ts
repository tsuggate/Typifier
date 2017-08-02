import {dispatch} from '../../state/state';
import * as _ from 'underscore';


export function addLogLn(log: string): void {
   dispatch({type: 'ADD_LOG', log});
}

export function addLog(log: string): void {
   dispatch({type: 'ADD_LOG', log, sameLine: true});
}

export async function logProgress<Output>(description: string, operation: () => Output): Promise<Output> {
   const t1 = _.now();

   try {
      console.log('before');
      const promise = new Promise<Output>(resolve => {
         setTimeout(() => {
            try {
               resolve(operation());
            }
            catch (e) {
               addLogLn(e.stack);
               resolve();
            }

         }, 0);
      });

      addLogLn(description + '...');

      const output = await promise;

      addLog(` - ${calcTime(t1)}`);

      return output;
   }
   catch (e) {
      console.log('catch');
      addLogLn(e.stack);
      throw e;
   }
}

export function calcTime(start: number) {
   return `${_.now() - start}ms`;
}

