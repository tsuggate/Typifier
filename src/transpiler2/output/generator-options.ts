import {ESComment} from './generators/comments';
import {Node, Program} from 'estree';
import {parseJavaScript} from '../util/javascript-parser';
import {findParentNode} from '../symbols/symbols';

export type OutputLanguage = 'javascript' | 'typescript';



export interface GeneratorOptions {
   language?: OutputLanguage;
   insertAny?: boolean;
   includeComments?: boolean;
}

export class GenOptions {

   private inputCode: string;

   private program: Program;

   private language: OutputLanguage;

   private includeComments: boolean = true;

   // Default to inserting any if language is typescript.
   private insertAny: boolean = true;

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

      // Default to true if option undefined.
      if (typeof options.includeComments !== 'undefined') {
         this.includeComments = options.includeComments;
      }

      // Default to true if option undefined.
      if (typeof options.insertAny !== 'undefined') {
         this.insertAny = options.insertAny;
      }
   }

   getLanguage(): OutputLanguage {
      return this.language;
   }

   isTypeScript(): boolean {
      return this.language === 'typescript';
   }

   shouldInsertAny(): boolean {
      return this.isTypeScript() && this.insertAny;
   }

   getProgram(): Program {
      if (!this.program) {
         throw new Error('program is not initialised');
      }

      return this.program;
   }

   findParentNode(node: Node): Node | null {
      return findParentNode(this.program, node);
   }

   findGranParentNode(node: Node): Node | null {
      const parent = findParentNode(this.program, node);

      if (parent) {
         return findParentNode(this.program, parent);
      }
      return null;
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
