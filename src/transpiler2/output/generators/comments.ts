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
   if (options.comments()) {

      const leading = generateLeadingComments(node, options);
      const trailing = generateTrailingComments(node, options);

      return leading + code + trailing;
   }
   return code;
}

function generateLeadingComments(node: Node, options: GenOptions) {
   if (node.leadingComments) {
      const comments = node.leadingComments as ESComment[];

      return comments.map((c, i) => generateComment(c, 'leading', node, options, i)).join('');
   }
   return '';
}

function generateTrailingComments(node: Node, options: GenOptions) {
   if (node.trailingComments) {
      const comments = node.trailingComments as ESComment[];

      return comments.map((c, i) => generateComment(c, 'trailing', node, options, i)).join('');
   }
   return '';
}

export function generateComment(comment: ESComment, type: 'trailing' | 'leading', node: Node, options: GenOptions, index: number): string {
   let res;

   if (comment.type === 'Line') {
      if (type === 'trailing') {
         res = generateTrailingLineComment(comment, options, index);
      }
      else {
         res = generateLeadingLineComment(comment, options, index);
      }
   }
   else {
      res = generateBlockComment(comment, type, node, options);
   }
   return res;
}

function isCommentOnNewLine(comment: ESComment, options: GenOptions) {
   const code = options.getInputCode();

   for(let i = comment.range[0] - 1; i >= 0;  i--) {
      const c = code[i];

      if (c !== ' ') {
         return isLineEnding(c);
      }
   }
   return false;
}

function isLineEnding(c: string): boolean {
   return c === '\n' || c === '\r\n';
}

function generateLeadingLineComment(comment: ESComment, options: GenOptions, index: number) {
   let res = '';

   if (options.commentAlreadyGenerated(comment)) {
      return res;
   }

   options.setCommentAsGenerated(comment);

   if (isCommentOnNewLine(comment, options) && !(index > 0)) {
      res = `\n//${comment.value} \n`;
   }
   else {
      res = `//${comment.value} \n`;
   }

   return res;
}

function generateTrailingLineComment(comment: ESComment, options: GenOptions, index: number) {
   let res = '';

   if (options.commentAlreadyGenerated(comment)) {
      return res;
   }

   options.setCommentAsGenerated(comment);

   if (isCommentOnNewLine(comment, options) && !(index > 0)) {
      res = `\n//${comment.value} \n`;
   }
   else {
      res = `//${comment.value} \n`;
   }

   return res;
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

// function printComment(comment: ESComment, type: 'trailing' | 'leading', options: GenOptions) {
//    if (comment.type === 'Line') {
//       console.log(`//${comment.value} [${comment.range[0]}, ${comment.range[1]}] ${type} ${options.commentAlreadyGenerated(comment)}`);
//    }
//    else {
//       console.log(`/*${comment.value} [${comment.range[0]}, ${comment.range[1]}] ${type} ${options.commentAlreadyGenerated(comment)} */`);
//    }
// }
