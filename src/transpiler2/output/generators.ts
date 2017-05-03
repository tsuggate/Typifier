import {Identifier, Literal, Program, Property} from 'estree';
import {generate} from './generate';


export function programToJs(program: Program): string {
   if (program.sourceType === 'script') {
      return program.body.map(node => generate(node)).join('');
   }
   else {
      return 'Not Implemented! (programToJs)';
   }
}

export function identifierToJs(i: Identifier): string {
   return i.name;
}

export function literalToJs(l: Literal): string {
   return l.raw;
}

export function propertyToJs(p: Property): string {
   if (p.method) {
      throw 'propertyToJs.method not implemented!';
   }
   else if (p.shorthand) {
      throw 'propertyToJs.shorthand not implemented!';
   }
   else if (p.computed) {
      throw 'propertyToJs.computed not implemented!';
   }
   else {
      return `${generate(p.key)}: ${generate(p.value)}`;
   }
}

