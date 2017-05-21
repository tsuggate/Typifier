import {walk} from 'estree-walker';
import * as esprima from "esprima";
import {Node, Program} from 'estree';
import {traverse} from '../util/misc';


export class Symbol {

}

export class Scope {

   range: [number, number];

   children: Scope[];

   constructor() {

   }
}


export function run(code: string) {
   console.log('hello symbols');

   const program = esprima.parse(code, { range: true });

   traverse(program, (node) => {
      console.log(node);
   });

}

