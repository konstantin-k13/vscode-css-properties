import * as vscode from 'vscode';

export const readFile = (file: vscode.TextDocument) => {
  return file.getText();
};

export const writeFile = (fileContents: string) => {
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