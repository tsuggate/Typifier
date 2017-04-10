import {BlockStatement, ReturnStatement} from 'estree';
import {generate} from '../output';


export function blockStatement(s: BlockStatement): string {
   return s.body.map(generate).join('\n');
}

export function returnStatement(s: ReturnStatement): string {
   return `return ${s.argument ? generate(s.argument) : ''};`;
}