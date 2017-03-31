
export function isString(str: any): boolean {
   return typeof str === 'string' || str instanceof String;
}

export function isNumber(n) {
   return !isNaN(parseFloat(n)) && isFinite(n);
}