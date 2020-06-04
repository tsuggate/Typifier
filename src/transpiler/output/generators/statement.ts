import {
  BlockStatement,
  BreakStatement,
  CatchClause,
  ContinueStatement,
  DoWhileStatement,
  EmptyStatement,
  ForInStatement,
  ForStatement,
  IfStatement,
  ReturnStatement,
  SwitchCase,
  SwitchStatement,
  ThrowStatement,
  TryStatement,
  WhileStatement,
} from 'estree';
import {generate} from '../generate';
import {GenOptions} from '../generator-options';

export function blockStatement(s: BlockStatement, options: GenOptions): string {
  return '{' + s.body.map((s) => generate(s, options)).join('') + '}';
}

export function returnStatement(s: ReturnStatement, options: GenOptions): string {
  return `return ${s.argument ? generate(s.argument, options) : ''};`;
}

export function ifStatement(s: IfStatement, options: GenOptions): string {
  let conditional = `if (${generate(s.test, options)}) ${generate(s.consequent, options)}`;

  if (s.alternate) {
    conditional += `else ${generate(s.alternate, options)}`;
  }

  return conditional;
}

export function forStatement(s: ForStatement, options: GenOptions): string {
  const init = s.init ? generate(s.init, options) : '';
  const test = s.test ? generate(s.test, options) : '';
  const update = s.update ? generate(s.update, options) : '';
  const body = generate(s.body, options);

  return `for (${
    s.init && s.init.type === 'VariableDeclaration' ? init : init + ';'
  } ${test}; ${update}) ${body}`;
}

export function switchStatement(s: SwitchStatement, options: GenOptions): string {
  const cases = s.cases.map((c) => generate(c, options)).join('\n');

  return `switch (${generate(s.discriminant, options)}) { ${cases} }`;
}

export function switchCase(s: SwitchCase, options: GenOptions): string {
  const consequent = s.consequent.map((c) => generate(c, options)).join('\n');

  if (s.test) {
    return `case ${generate(s.test, options)}: \n ${consequent}`;
  } else {
    return `default: \n ${consequent}`;
  }
}

export function breakStatement(s: BreakStatement, options: GenOptions): string {
  if (s.label) {
    return `break ${s.label};`;
  } else {
    return `break;`;
  }
}

export function continueStatement(s: ContinueStatement, options: GenOptions): string {
  return 'continue;';
}

export function forInStatement(s: ForInStatement, o: GenOptions): string {
  const variableDec = removeTrailingSemicolon(generate(s.left, o));

  return `for (${variableDec} in ${generate(s.right, o)}) ${generate(s.body, o)}`;
}

function removeTrailingSemicolon(code: string): string {
  if (code.endsWith(';')) {
    return code.slice(0, -1);
  }
  return code;
}

export function throwStatement(s: ThrowStatement, o: GenOptions): string {
  return `throw ${generate(s.argument, o)};`;
}

export function tryStatement(s: TryStatement, o: GenOptions): string {
  const handler = s.handler ? generate(s.handler, o) : '';
  const finalizer = s.finalizer ? ' finally ' + generate(s.finalizer, o) : '';

  return `try ${generate(s.block, o)} ${handler} ${finalizer}`;
}

export function catchClause(c: CatchClause, o: GenOptions): string {
  return `catch (${generate(c.param!, o)}) ${generate(c.body, o)}`;
}

export function whileStatement(s: WhileStatement, o: GenOptions): string {
  return `while (${generate(s.test, o)}) ${generate(s.body, o)}`;
}

export function doWhileStatement(s: DoWhileStatement, o: GenOptions): string {
  return `do ${generate(s.body, o)} while (${generate(s.test, o)})`;
}

export function emptyStatement(s: EmptyStatement, o: GenOptions): string {
  return ';';
}
