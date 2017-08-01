import {AssignmentPattern, Identifier, Literal, Program, Property, TemplateLiteral} from 'estree';
import {generate} from '../generate';
import {GenOptions} from '../generator-options';


export function programToJs(program: Program, options: GenOptions): string {
   if (program.sourceType === 'script') {
      return program.body.map(node => generate(node, options)).join('');
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

export function propertyToJs(p: Property, options: GenOptions): string {
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
      // if (options.shouldInsertAny() && p.key.type === 'Identifier'
      //    && p.key.name === 'write' && p.value.type === 'FunctionExpression') {
      //    return `${generate(p.key, options)}: (${generate(p.value, options)} as any)`;
      // }

      return `${generate(p.key, options)}: ${generate(p.value, options)}`;
   }
}

export function templateLiteral(t: TemplateLiteral, options: GenOptions): string {
   const str = t.quasis.map((q, i) => {
      if (!q.tail) {
         return q.value.raw + '${' + generate(t.expressions[i], options) + '}';
      }
      else {
         return q.value.raw;
      }
   }).join('');

   return `\`${str}\``;
}

export function assignmentPattern(p: AssignmentPattern, options: GenOptions): string {
   return `${generate(p.left, options)} = ${generate(p.right, options)}`;
}
