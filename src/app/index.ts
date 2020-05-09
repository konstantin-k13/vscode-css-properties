import * as vscode from 'vscode';
import * as css from 'css';
import { Disposable } from "@hediet/std/disposable";
import getSortingAlgorithm from './utils/getSortingAlgorithm';
import { TYPE_NOT_SUPPORTED, CSS_PARSE_ERROR } from './constants/errors';
import { ALPHABETICAL } from './constants/sort';
import { Sort, SortConstructable } from './typed/sort';

export class App {
  public readonly dispose = Disposable.fn();

  constructor() { }

  init = () => {
    const file = vscode.window.activeTextEditor?.document;
    if (!file || file.languageId !== 'css') {
      vscode.window.showWarningMessage(TYPE_NOT_SUPPORTED);
      return;
    }
    return this.processFile(file);
  };

  processFile = (file: vscode.TextDocument) => {
    const data = this.readFile(file);
    try {
      const code: css.Stylesheet = css.parse(data);
      if (!code.stylesheet) {
        throw new Error(CSS_PARSE_ERROR);
      }
      const rules = code.stylesheet.rules.reduce((total: Array<css.Rule>, current: css.Rule) => {
        const declarations: css.Rule = this.handleDeclarations(current);
        return total.concat(declarations);
      }, []);
      code.stylesheet.rules = rules;
      const fileContents = css.stringify(code);
      return this.writeFile(fileContents);
    } catch (e) {
      vscode.window.showErrorMessage(CSS_PARSE_ERROR);
    }
  };

  handleDeclarations = (rule: css.Rule): css.Rule => {
    const entries: Array<css.Comment | css.Declaration> | undefined = rule.declarations;
    if (!entries) {
      return rule;
    }
    const decs: Array<css.Declaration> = entries.filter(val => val.type === 'declaration');
    const Algorithm: SortConstructable | undefined = getSortingAlgorithm(ALPHABETICAL);
    if (!Algorithm) {
      return rule;
    }

    const sort: Sort = new Algorithm();
    const sorted = sort.sort(decs);
    rule.declarations = sorted;
    return rule;
  };

  readFile = (file: vscode.TextDocument) => {
    return file.getText();
  };

  writeFile = (fileContents: string) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const { document } = editor;
    const startPosition = new vscode.Position(0, 0);
    const { length } = document.lineAt(document.lineCount - 1).text;
    const endPosition = new vscode.Position(document.lineCount, length);
    const range = new vscode.Range(startPosition, endPosition);
    return [
      vscode.TextEdit.replace(range, fileContents)
    ];
  };
}