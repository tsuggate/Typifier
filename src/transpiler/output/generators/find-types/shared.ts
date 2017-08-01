

export type CodeRange = [number, number];


export function insideScope(range: CodeRange, scope: CodeRange): boolean {
   return scope[0] <= range[0] && scope[1] >= range[1];
}

export function equalRange(a: CodeRange, b: CodeRange): boolean {
   return a[0] === b[0] && a[1] === b[1];
}