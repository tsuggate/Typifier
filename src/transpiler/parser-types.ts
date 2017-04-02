
export type TypeName = 'JsString' | 'FuncAnon' | 'Define';

export interface PType {
  type: TypeName;
}

export interface JsString extends PType {
  value: string;
}

export function mkJsString(res: string): JsString {
  return {
    type: 'JsString',
    value: res.replace(/['"]+/g, '')
  };
}

export interface FuncAnon extends PType {
  args: string[];
  body: any;
}

export function mkFuncAnon(res) {
  return {
    type: 'FuncAnon',
    args: res[2],
    body: {}
  }
}

export interface Define extends PType {
  libsArray: JsString[];
  body: FuncAnon
}

export function mkDefine(res) {
  // console.log(res);

  return {
    type: 'Define',
    libsArray: res[2],
    body: res[4]
  };
}

// export interface LibsArray extends PType {
//   names: JsString[];
// }
//
// export function mkLibsArray(res): LibsArray {
//   return {
//     type: 'LibsArray',
//     names: res[1]
//   };
// }

// export interface FuncArgs extends PType {
//   names: string[];
// }
//
// export function mkFuncArgs(res) {
//   return {
//     type: 'FuncArgs',
//     names: res
//   };
// }
