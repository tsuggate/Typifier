

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

   setOptions(options: GeneratorOptions): void {
      this.language = options.language ? options.language : 'javascript';
      this.includeComments = typeof options.includeComments !== 'undefined' ? options.includeComments : true;
   }

   getLanguage(): OutputLanguage {
      return this.language;
   }
}

