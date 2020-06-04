import {generate} from '../transpiler/output/generate';
import {reformatCode} from '../test/shared';
import {getJavaScriptFile} from './state/state';
import {Program} from 'estree';
import * as escodegen from 'escodegen';
import {GeneratorOptions, GenOptions} from '../transpiler/output/generator-options';
import {addLogLn, logProgress} from './home/log/logger';
import {parseJavaScript} from '../transpiler/util/javascript-parser';
import {prettify} from '../transpiler/util/format-code';
import * as _ from 'underscore';

interface JavascriptOutput {
  matches: boolean;
  generated: string;
  escodegen: string;
}

export interface TranspileOutput {
  code: string;
  success: boolean;
  javascriptOutput: JavascriptOutput | null;
}

export async function transpile(
  code: string,
  generatorOptions?: GeneratorOptions
): Promise<TranspileOutput> {
  try {
    const options = new GenOptions(generatorOptions || {}, code);

    const program = await logProgress<Program>(`Parsing ${getJavaScriptFile()}`, () =>
      parseJavaScript(code, {includeComments: true})
    );

    console.log(program);

    const estreesMatch = await logProgress<boolean>(`Checking estrees match`, () =>
      checkJsGeneration(code)
    );

    if (!estreesMatch) {
      addLogLn(`estrees didn't match`);

      return {code: '', success: false, javascriptOutput: null};
    }

    const javascriptOutput = await logProgress<JavascriptOutput>(
      `Checking code gen matches escodegen`,
      () => jsGenerators(program, code)
    );

    if (!javascriptOutput.matches) {
      addLogLn(`JS code generation didn't match`);
      console.log(javascriptOutput);

      return {code: '', success: false, javascriptOutput};
    }

    const out = await logProgress<string>(`Generating ${options.getLanguage()}`, () =>
      generate(program, options)
    );

    const outputCode = prettify(out);

    return {code: outputCode, success: true, javascriptOutput};
  } catch (e) {
    console.log(e);
    addLogLn(e.stack);

    return {code: '', success: false, javascriptOutput: null};
  }
}

export function checkJsGeneration(code: string): boolean {
  try {
    const program = parseJavaScript(code, {locationData: false});

    const options = new GenOptions({}, code);
    const generatedCode = generate(program, options);

    const program2 = parseJavaScript(generatedCode, {locationData: false});

    return _.isEqual(program, program2) && JSON.stringify(program) === JSON.stringify(program2);
  } catch (e) {
    addLogLn('checkJsGeneration failed:');
    addLogLn(e.stack);
    console.log(e);
    return false;
  }
}

export function jsGenerators(program: Program, code: string): JavascriptOutput {
  // printAST(code);

  const options = new GenOptions({}, code);

  let generatedCode, myOutput;

  try {
    generatedCode = generate(program, options);
  } catch (e) {
    addLogLn('Generating JavaScript code failed:');
    addLogLn(e.stack);
    console.log(e);
  }

  try {
    myOutput = reformatCode(generatedCode || '', 'jsGenerators: generatedCode');
  } catch (e) {
    addLogLn('Reformatting generated code failed:');
    addLogLn(e.stack);
    console.log(e);
  }

  const esCodegenOutput = escodegen.generate(program);

  const matches = myOutput === esCodegenOutput;

  if (!matches) {
    return {
      matches: matches,
      generated: myOutput ? myOutput : generatedCode || '',
      escodegen: esCodegenOutput,
    };
  }

  return {
    matches: matches,
    generated: myOutput || '',
    escodegen: esCodegenOutput,
  };
}
