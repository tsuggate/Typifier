import {Program, VariableDeclaration} from 'estree';
import {generate} from './output';


export function programToJs(program: Program): string {
   if (program.sourceType === 'script') {
      return program.body.map(node => generate(node)).join('');
   }
   else {
      return 'Not Implemented! (programToJs)';
   }
}

export function variableDeclarationToJs(varDec: VariableDeclaration): string {


   return '';
}