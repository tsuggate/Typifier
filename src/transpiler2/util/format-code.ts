import * as jsBeautify from 'js-beautify';


export const jsBeautifyOptions = {
   indent_size: 3,
   indent_char: ' '
};

export function prettify(code: string): string {
   return jsBeautify(code, jsBeautifyOptions);
}
