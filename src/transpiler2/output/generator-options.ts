

import {ESComment} from "./generators/comments";
export type OutputLanguage = 'javascript' | 'typescript';


export interface GeneratorOptions {
   language?: OutputLanguage;
   includeComments?: boolean;
}


export class GenOptions {

   constructor(options?: GeneratorOptions) {
      this.setOptions(options || {});
   }

   private language: OutputLanguage;

   private includeComments: boolean;

   private generatedComments: ESComment[] = [];

   setOptions(options: GeneratorOptions): void {
      this.language = options.language ? options.language : 'javascript';
      this.includeComments = typeof options.includeComments !== 'undefined' ? options.includeComments : true;
   }

   getLanguage(): OutputLanguage {
      return this.language;
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
