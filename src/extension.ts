import * as vscode from 'vscode';
import {
	enableHotReload,
	hotRequire,
	registerUpdateReconciler,
} from "@hediet/node-reload";

import * as extension from './app/index';

enableHotReload({ entryModule: module });
registerUpdateReconciler(module);

export function activate(context: vscode.ExtensionContext) {
	let app: extension.App | null = null;

	hotRequire<typeof extension>(module, "./app/index", logic => {
		console.log('Files changed. Reloading codebase.');
		app = new logic.App();
		return app;
	});

	vscode.languages.registerDocumentFormattingEditProvider('css', {
		provideDocumentFormattingEdits(): vscode.TextEdit[] | undefined {
			if (app !== null) {
				return app.init();
			}
		}
	});
}

export function deactivate() { }
