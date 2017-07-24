import {ESComment} from './generators/comments';
import * as esprima from 'esprima';
import {Program} from 'estree';
import {parseJavaScript} from '../util/javascript-parser';

export type OutputLanguage = 'javascript' | 'typescript';



export interface GeneratorOptions {
   language?: OutputLanguage;
   includeComments?: boolean;
}

export class GenOptions {

   private inputCode: string;

   private program: Program;

   private language: OutputLanguage;

   private includeComments: boolean;

   private generatedComments: ESComment[] = [];

   constructor(options: GeneratorOptions, code: string) {
      this.setOptions(options);

      if (options.includeComments && !code) {
         throw new Error(`GenOptions: Code not provided. This is required for outputting comments.`);
      }

      if (options.language === 'typescript' && !code) {
         throw new Error(`GenOptions: Code not provided. This is required for outputting Typescript.`);
      }

      if (code) {
         this.inputCode = code;

         try {
            this.program = parseJavaScript(code);
         }
         catch (e) {
            throw new Error(`GenOptions: Esprima failed to parse code. ${e.stack}`)
         }
      }
   }

   setOptions(options: GeneratorOptions): void {
      this.language = options.language ? options.language : 'javascript';
      // Default to true? TODO: This keeps confusing me.
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

   getInputCode(): string {
      return this.inputCode;
   }
}

function equals(a: ESComment, b: ESComment): boolean {
   return a.range[0] === b.range[0] && a.range[1] === b.range[1] && a.value === b.value;
}
