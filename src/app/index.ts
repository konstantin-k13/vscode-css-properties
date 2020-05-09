import * as vscode from 'vscode';
import * as css from 'css';
import { Disposable } from "@hediet/std/disposable";

import RuleHandler from './modules/rules';
import { readFile, writeFile } from './utils/files';
import { TYPE_NOT_SUPPORTED, CSS_PARSE_ERROR } from './constants/errors';

export class App {
  public readonly dispose = Disposable.fn();

  constructor() { }

  init = () => {
    console.clear();
    const file = vscode.window.activeTextEditor?.document;
    if (!file || file.languageId !== 'css') {
      vscode.window.showWarningMessage(TYPE_NOT_SUPPORTED);
      return;
    }
    return this.processFile(file);
  };

  processFile = (file: vscode.TextDocument) => {
    const ruleHandler = new RuleHandler();
    const data = readFile(file);
    try {
      const code: css.Stylesheet = css.parse(data);
      if (code.stylesheet) {
        const rules = code.stylesheet.rules.reduce((total: Array<css.Rule>, current) => {
          return total.concat(ruleHandler.process(current));
        }, []);
        code.stylesheet.rules = rules;
        const fileContents = css.stringify(code);
        return writeFile(fileContents);
      }
    } catch (e) {
      vscode.window.showErrorMessage(CSS_PARSE_ERROR);
    }
  };
}