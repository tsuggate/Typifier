import {BlockStatement} from 'estree';
import {generate} from '../output';


export function blockStatement(s: BlockStatement) {
   return s.body.map(generate).join('\n');
}