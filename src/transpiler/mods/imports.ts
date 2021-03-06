import {
  ArrayExpression,
  CallExpression,
  Declaration,
  ExpressionStatement,
  FunctionExpression,
  Literal,
  ReturnStatement,
  VariableDeclaration,
} from 'estree';
import {generate} from '../output/generate';
import {getNamesFromDeclaration, isDeclaration} from '../output/generators/declaration';
import * as _ from 'underscore';
import {GenOptions} from '../output/generator-options';
import {appName} from '../../renderer/util/config';

const recognisedLibraries = ['underscore', 'jquery', 'knockout'];

export function isDefine(es: ExpressionStatement): boolean {
  const e = es.expression;

  if (e.type === 'CallExpression' && e.callee.type === 'Identifier') {
    return e.callee.name === 'define';
  }

  return false;
}

export function generateImports(es: ExpressionStatement, options: GenOptions): string {
  let hasDefaultExport = false;
  const e = es.expression as CallExpression;
  // Use first arg if there is only a function and no library array.
  const func = (e.arguments[1] || e.arguments[0]) as FunctionExpression;

  const libraryNames = getLibraryNames(e, options);
  const importNames = getImportNames(func, options);

  const exportNames = getExportNames(func, importNames, options);
  const imports = makeImports(libraryNames, importNames, exportNames);

  const body = func.body.body
    .map((e) => {
      if (isDeclaration(e) && exportNames.length > 1) {
        return generateDeclaration(e as Declaration, exportNames, options);
      } else if (e.type === 'ReturnStatement') {
        if (exportNames.length <= 1) {
          const defaultExport = makeDefaultExport(e, options);

          if (defaultExport) {
            hasDefaultExport = true;
          }
          return defaultExport;
        }
        return '';
      } else {
        return generate(e, options);
      }
    })
    .join('');

  const definitions = hasDefaultExport
    ? ''
    : makeDefinitionsForMissingExports(func, options, importNames);

  return `${imports.join('')} ${body} ${definitions}`;
}

function makeDefaultExport(e: ReturnStatement, options: GenOptions): string {
  if (e.argument) {
    if (e.argument.type === 'MemberExpression') {
      return `export = (${generate(e.argument, options)});`;
    }

    return `export = ${generate(e.argument, options)};`;
  }
  return '';
}

function getLibraryNames(e: CallExpression, options: GenOptions): string[] {
  const namesArrayExpression = e.arguments[0] as ArrayExpression;

  if (namesArrayExpression.elements) {
    return namesArrayExpression.elements.map((n) => {
      return generate(n, options);
    });
  }
  return [];
}

function getImportNames(e: FunctionExpression, options: GenOptions): string[] {
  if (e && e.params) {
    return e.params.map((p) => {
      return generate(p, options);
    });
  }
  return [];
}

function makeImports(
  libraryNames: string[],
  importNames: string[],
  exportNames: string[]
): string[] {
  let imports = importNames.map((n, i) => {
    if (_.contains(exportNames, n)) {
      return `export const ${n} = require(${libraryNames[i]});`;
    }
    if (_.contains(recognisedLibraries, libraryNames[i].replace(/['"]+/g, ''))) {
      return `import * as ${n} from ${libraryNames[i]};`;
    }

    return `const ${n} = require(${libraryNames[i]});`;
  });

  const nonBoundImports = getNonBoundImports(libraryNames, importNames);

  imports = imports.concat(
    nonBoundImports.map((n) => {
      return `import ${n};`;
    })
  );

  return imports;
}

function getNonBoundImports(libraryNames: string[], importNames: string[]): string[] {
  return _.rest(libraryNames, importNames.length);
}

function getExportNames(
  func: FunctionExpression,
  importNames: string[],
  options: GenOptions
): string[] {
  const returnStatement = func.body.body.find((e) => e.type === 'ReturnStatement') as
    | ReturnStatement
    | undefined;

  if (returnStatement && returnStatement.argument) {
    const arg = returnStatement.argument;

    if (arg.type === 'ObjectExpression') {
      return arg.properties.map((p: any) => {
        const key = generate(p.key, options);

        if (p.value.type === 'Identifier') {
          const value = generate(p.value, options);

          if (value !== key && importNames.includes(key)) {
            throw new Error(
              `${appName} can't export "${value}" as "${key}" since "${key}" is the name of an import. Try renaming "${key}".`
            );
          }
        }

        return key;
      });
    } else if (arg.type === 'Identifier') {
      return [generate(arg, options)];
    } else {
      // console.log(arg.type, arg);
      // throw new Error('getExportNames failed');
    }
  }
  return [];
}

function generateDeclaration(d: Declaration, exportNames: string[], options: GenOptions): string {
  const names = getNamesFromDeclaration(d, options);

  if (_.every(names, (n) => _.contains(exportNames, n))) {
    return `export ${generate(d, options)}`;
  }
  return generate(d, options);
}

function makeDefinitionsForMissingExports(
  func: FunctionExpression,
  options: GenOptions,
  importNames: string[]
) {
  const decs: string[] = _.flatten(
    func.body.body
      .filter((e) => e.type.includes('Declaration'))
      .map((e) => getNamesFromDeclaration(e as Declaration, options))
  ).concat(importNames);

  const returnStatement = func.body.body.find((e) => e.type === 'ReturnStatement') as
    | ReturnStatement
    | undefined;

  if (returnStatement && returnStatement.argument) {
    const arg = returnStatement.argument;

    if (arg.type === 'ObjectExpression') {
      const properties = arg.properties.filter((p: any) => {
        const name = generate(p.key, options);

        return !_.contains(decs, name);
      });

      return properties
        .map(
          (p: any) => `export const ${generate(p.key, options)} = ${generate(p.value, options)};`
        )
        .join('\n');
    }
    // else {
    //    throw new Error('makeDefinitionsForMissingExports failed');
    // }
  }
  return '';
}

export function isRequireStatement(dec: VariableDeclaration): boolean {
  if (dec.declarations.length === 1) {
    const d = dec.declarations[0];

    return (
      !!d.init &&
      d.init.type === 'CallExpression' &&
      d.init.callee.type === 'Identifier' &&
      d.init.callee.name === 'require'
    );
  }
  return false;
}

export function isRecognisedRequireStatement(dec: VariableDeclaration): boolean {
  if (isRequireStatement(dec)) {
    const d = dec.declarations[0].init as CallExpression;

    if (d.arguments.length === 1 && d.arguments[0].type === 'Literal') {
      const l = d.arguments[0] as Literal;

      return recognisedLibraries.includes(`${l.value}`);
    }
  }

  return false;
}

export function generateImportFromRequireStatement(
  dec: VariableDeclaration,
  options: GenOptions
): string {
  const d = dec.declarations[0];
  const callExpression = d.init as CallExpression;
  const l = callExpression.arguments[0] as Literal;

  return `import * as ${generate(d.id, options)} from '${l.value}';`;
}
