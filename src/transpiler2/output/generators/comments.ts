import {Node} from 'estree';

let generatedComments: ESComment[] = [];

interface ESComment {
   range: number[];
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
      return generateComments(node.leadingComments as ESComment[]);
   }
   return '';
}

function generateTrailingComments(node: Node) {
   if (node.trailingComments) {
      return generateComments(node.trailingComments as ESComment[]);
   }
   return '';
}

function generateComments(comments: ESComment[]): string {
   return comments.map(c => {
      if (commentAlreadyGenerated(c)) {
         return '';
      }
      else if (c.type === 'Line') {
         generatedComments.push(c);
         return `//${c.value}\n`;
      }
      generatedComments.push(c);
      return `/*${c.value}*/`;
   }).join('');
}


function commentAlreadyGenerated(c: ESComment): boolean {
   return generatedComments.some(gc => equals(c, gc));
}

function equals(a: ESComment, b: ESComment): boolean {
   return a.range[0] === b.range[0] && a.range[1] === b.range[1];
}
