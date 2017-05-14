import {Node, SourceLocation} from 'estree';
import {GenOptions} from "../generator-options";

// let generatedComments: ESComment[] = [];

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

function printComment(comment: ESComment, type: 'trailing' | 'leading', options: GenOptions) {
   if (comment.type === 'Line') {
      console.log(`//${comment.value} [${comment.range[0]}, ${comment.range[1]}] ${type} ${options.commentAlreadyGenerated(comment)}`);
   }
   else {
      console.log(`/*${comment.value} [${comment.range[0]}, ${comment.range[1]}] ${type} ${options.commentAlreadyGenerated(comment)} */`);
   }

}

function generateComment(comment: ESComment, type: 'trailing' | 'leading', node: Node, options: GenOptions): string {
   let res;

   // printComment(comment, type, options);

   if (comment.type === 'Line') {
      res = generateLineComment(comment, type, node, options);
   }
   else {
      res = generateBlockComment(comment, type, node, options);
   }

   return res;
}

/*

 Idea: Only generate trailing comments if they are on the same line.

 */

function generateLineComment(comment: ESComment, type: 'trailing' | 'leading', node: Node, options: GenOptions) {
   let res = '';

   if (options.commentAlreadyGenerated(comment)) {
      return res;
   }

   if (type === 'trailing') {
      if (node.loc && comment.loc.start.line === node.loc.start.line) {
         // generatedComments.push(comment);
         options.setCommentAsGenerated(comment);
         res = `//${comment.value}`;
      }
   }
   else {
      // generatedComments.push(comment);
      options.setCommentAsGenerated(comment);
      res = `\n//${comment.value}\n`;
   }

   return res;
}

function generateBlockComment(comment: ESComment, type: 'trailing' | 'leading', node: Node, options: GenOptions) {
   let res = '';

   if (options.commentAlreadyGenerated(comment)) {
      return res;
   }

   if (type === 'trailing') {
      if (node.loc && comment.loc.start.line === node.loc.start.line) {
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

// function commentAlreadyGenerated(c: ESComment): boolean {
//    return generatedComments.some(gc => equals(c, gc));
// }
//
// function equals(a: ESComment, b: ESComment): boolean {
//    // return false;
//    // console.log(a);
//    return a.range[0] === b.range[0] && a.range[1] === b.range[1] && a.value === b.value;
// }
