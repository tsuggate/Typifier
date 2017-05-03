import {Node, SourceLocation} from 'estree';

let generatedComments: ESComment[] = [];

interface ESComment {
   range: number[];
   loc: SourceLocation;
   type: 'Line' | 'Block';
   value: string;
}

// TODO: Look at node position and figure out whether new lines should be inserted.
export function insertComments(code: string, node: Node): string {
   const leading = generateLeadingComments(node);
   const trailing = generateTrailingComments(node);

   return leading + code + trailing;
}

function generateLeadingComments(node: Node) {
   if (node.leadingComments) {
      const comments = node.leadingComments as ESComment[];

      return comments.map(c => generateComment(c, 'leading', node)).join('');
   }
   return '';
}

function generateTrailingComments(node: Node) {
   if (node.trailingComments) {
      const comments = node.trailingComments as ESComment[];

      return comments.map(c => generateComment(c, 'trailing', node)).join('');
   }
   return '';
}

function generateComment(comment: ESComment, type: 'trailing' | 'leading', node: Node): string {
   let res;

   if (comment.type === 'Line') {
      res = generateLineComment(comment, type, node);
   }
   else {
      res = generateBlockComment(comment, type, node);
   }

   return res;
}

/*

 Idea: Only generate trailing comments if they are on the same line.

 */

function generateLineComment(comment: ESComment, type: 'trailing' | 'leading', node: Node) {
   let res = '';

   if (commentAlreadyGenerated(comment)) {
      return res;
   }

   if (type === 'trailing') {
      if (node.loc && comment.loc.start.line === node.loc.start.line) {
         generatedComments.push(comment);
         res = `//${comment.value}`;
      }
   }
   else {
      res = `\n//${comment.value}\n`;
   }

   return res;
}

function generateBlockComment(comment: ESComment, type: 'trailing' | 'leading', node: Node) {
   let res = '';

   if (commentAlreadyGenerated(comment)) {
      return res;
   }

   if (type === 'trailing') {
      if (node.loc && comment.loc.start.line === node.loc.start.line) {
         generatedComments.push(comment);
         res =  `/*${comment.value}*/`;
      }
   }
   else {
      generatedComments.push(comment);
      res = `/*${comment.value}*/`;
   }

   return res;
}

function commentAlreadyGenerated(c: ESComment): boolean {
   return generatedComments.some(gc => equals(c, gc));
}

function equals(a: ESComment, b: ESComment): boolean {
   return a.range[0] === b.range[0] && a.range[1] === b.range[1];
}
