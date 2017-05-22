import {ESComment} from './generators/comments';
import * as esprima from 'esprima';
import {Program} from 'estree';

export type OutputLanguage = 'javascript' | 'typescript';



export interface GeneratorOptions {
   language?: OutputLanguage;
   includeComments?: boolean;
}

export class GenOptions {

   private program: Program;

   private language: OutputLanguage;

   private includeComments: boolean;

   private generatedComments: ESComment[] = [];

   constructor(options: GeneratorOptions, code?: string) {
      this.setOptions(options);

      if (options.language === 'typescript' && !code) {
         throw new Error(`Code not provided to GenOptions. This is required for outputting Typescript.`);
      }

      if (code) {
         this.program = esprima.parse(code, { range: true });
      }
   }

   setOptions(options: GeneratorOptions): void {
      this.language = options.language ? options.language : 'javascript';
      this.includeComments = typeof options.includeComments !== 'undefined' ? options.includeComments : true;
   }

   getLanguage(): OutputLanguage {
      return this.language;
   }

   getProgram(): Program {
      if (!this.program) {
         throw new Error('program is not initialised');
      }

      return this.program;
   }

   comments(): boolean {
      return this.includeComments;
   }

   setCommentAsGenerated(comment: ESComment): void {
      this.generatedComments.push(comment);
   }

   commentAlreadyGenerated(comment: ESComment): boolean {
      return this.generatedComments.some(gc => equals(comment, gc));
   }
}

function equals(a: ESComment, b: ESComment): boolean {
   return a.range[0] === b.range[0] && a.range[1] === b.range[1] && a.value === b.value;
}
