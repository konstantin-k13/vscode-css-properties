import { enableHotReload, hotRequire } from "@hediet/node-reload";
import * as vscode from 'vscode';

enableHotReload({ entryModule: module });

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('css-properties.rearrange-css', () => {
		hotRequire<typeof import("./index")>(module, "./index", logic => {
			vscode.window.showInformationMessage('Hello World from CSS Properties!');
			return new logic.Extension();
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
