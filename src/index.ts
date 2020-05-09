import * as vscode from 'vscode';
import { TYPE_NOT_SUPPORTED } from './constants/errors';

export class Extension {
  constructor() {
    this.init();
  }

  init = () => {
    const file = vscode.window.activeTextEditor?.document;
    if (!file || file.languageId !== 'css') {
      vscode.window.showWarningMessage(TYPE_NOT_SUPPORTED);
      return;
    }
    this.processFile(file);
  };

  processFile = (file: vscode.TextDocument) => {
    const data = this.readFile(file);
    console.log(data);
  };

  readFile = (file: vscode.TextDocument) => {
    return file.getText();
  };

  dispose() {}
}