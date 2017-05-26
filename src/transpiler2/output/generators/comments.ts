import {Node, SourceLocation} from 'estree';
import {GenOptions} from "../generator-options";


/*

 Idea: Only generate trailing comments if they are on the same line.

 */

export interface ESComment {
   range: number[];
   loc: SourceLocation;
   type: 'Line' | 'Block';
   value: string;
}

// TODO: Look at node position and figure out whether new lines should be inserted.
export function insertComments(code: string, node: Node, options: GenOptions): string {
   const leading = generateLeadingComments(node, options);
   const trailing = generateTrailingComments(node, options);

   if (options.comments()) {
      // console.log(code);

      return leading + code + trailing;
   }
   return code;
}

function generateLeadingComments(node: Node, options: GenOptions) {
   if (node.leadingComments) {
      const comments = node.leadingComments as ESComment[];

      return comments.map(c => generateComment(c, 'leading', node, options)).join('');
   }
   return '';
}

function generateTrailingComments(node: Node, options: GenOptions) {
   if (node.trailingComments) {
      const comments = node.trailingComments as ESComment[];

      return comments.map(c => generateComment(c, 'trailing', node, options)).join('');
   }
   return '';
}

export function generateComment(comment: ESComment, type: 'trailing' | 'leading', node: Node, options: GenOptions): string {
   let res;

   printComment(comment, type, options);

   if (comment.type === 'Line') {
      res = generateLineComment(comment, options);
   }
   else {
      res = generateBlockComment(comment, type, node, options);
   }

   return res;
}

function generateLineComment(comment: ESComment, options: GenOptions) {
   let res = '';

   if (options.commentAlreadyGenerated(comment)) {
      return res;
   }

   // if (type === 'trailing') {
   //    if (node.loc && comment.loc.start.line === node.loc.start.line) {
         options.setCommentAsGenerated(comment);
         res = `//${comment.value}`;
      // }
   // }
   // else {
   //    options.setCommentAsGenerated(comment);
   //    res = `\n//${comment.value}\n`;
   // }

   return res;
}

export function generateComment2(comment: ESComment, options: GenOptions): string {
   let res;

   if (comment.type === 'Line') {
      res = generateLineComment2(comment, options);
   }
   else {
      res = generateBlockComment2(comment, options);
   }

   return res;
}

export function generateLineComment2(comment: ESComment, options: GenOptions): string {
   if (options.commentAlreadyGenerated(comment)) {
      return '';
   }

   options.setCommentAsGenerated(comment);
   return `//${comment.value}`;
}

export function generateBlockComment2(comment: ESComment, options: GenOptions) {
   if (options.commentAlreadyGenerated(comment)) {
      return '';
   }

   options.setCommentAsGenerated(comment);
   return `/*${comment.value}*/`;
}

function generateBlockComment(comment: ESComment, type: 'trailing' | 'leading', node: Node, options: GenOptions) {
   let res = '';

   if (options.commentAlreadyGenerated(comment)) {
      return res;
   }

   if (type === 'trailing') {
      if (node.loc && comment.loc.start.line === node.loc.end.line) {
         options.setCommentAsGenerated(comment);
         res =  `/*${comment.value}*/`;
      }
   }
   else {
      options.setCommentAsGenerated(comment);
      res = `/*${comment.value}*/`;
   }

   return res;
}

function printComment(comment: ESComment, type: 'trailing' | 'leading', options: GenOptions) {
   if (comment.type === 'Line') {
      console.log(`//${comment.value} [${comment.range[0]}, ${comment.range[1]}] ${type} ${options.commentAlreadyGenerated(comment)}`);
   }
   else {
      console.log(`/*${comment.value} [${comment.range[0]}, ${comment.range[1]}] ${type} ${options.commentAlreadyGenerated(comment)} */`);
   }
}

export function generateLeadingComments2(comments: ESComment[], options: GenOptions): string {
   if (!options.comments()) {
      return '';
   }

   return comments.map(c => generateComment2(c, options)).filter(c => c !== '').join('\n');
}

export function generateTrailingComments2(comments: ESComment[], options: GenOptions) {
   if (!options.comments()) {
      return '';
   }

   if (comments[0]) {
      return generateComment2(comments[0], options);
   }
   return '';
}

export function generateComments2(code: string, node: Node, options: GenOptions) {
   let leadingComments = '';
   let trailingComments = '';

   if (node.leadingComments) {
      const c = generateLeadingComments2(node.leadingComments as ESComment[], options);

      if (c) {
         leadingComments = '\n' + c + '\n';
      }
   }
   if (node.trailingComments) {
      const comments = node.trailingComments as ESComment[];

      if (comments[0] && node.loc && comments[0].loc.start === node.loc.end) {
         const c = generateTrailingComments2(comments, options);

         if (c) {
            trailingComments = c;
         }
      }
   }

   return leadingComments + code + trailingComments;
}