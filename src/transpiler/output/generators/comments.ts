import {Node, SourceLocation} from 'estree';
import {GenOptions} from "../generator-options";


export interface ESComment {
   range: number[];
   loc: SourceLocation;
   type: 'Line' | 'Block';
   value: string;
}

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
   if (comment.type === 'Line') {
      return generateLineComment(comment, options, index);
   }
   return generateBlockComment(comment, type, node, options);
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

function generateLineComment(comment: ESComment, options: GenOptions, index: number): string {
   if (options.commentAlreadyGenerated(comment)) {
      return '';
   }
   options.setCommentAsGenerated(comment);

   if (isCommentOnNewLine(comment, options) && !(index > 0)) {
      return `\n//${comment.value} \n`;
   }
   else {
      return `//${comment.value} \n`;
   }
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
