import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import ollama from 'ollama';


async function pullModel(model: string) {
	try {
		await ollama.pull({ model });
	} catch (error) {
		vscode.window.showErrorMessage(`Failed to pull model: ${String(error)}`);
		throw error; 
	}
}


function filterThinkTags(content: string): string {
	return content.replace(/<think>.*?<\/think>/gs, '').trim();
}


function getWebviewContent(context: vscode.ExtensionContext): string {
	const htmlPath = path.join(context.extensionPath, 'webview.html');
	return fs.readFileSync(htmlPath, 'utf8');
}

// Activate the extension
export function activate(context: vscode.ExtensionContext) {


	const disposable = vscode.commands.registerCommand('deep-seek.start', async () => {
		try {
			await pullModel('deepseek-r1:latest');
			const panel = vscode.window.createWebviewPanel(
				'deep-seek',
				'Deep Seek Chat',
				vscode.ViewColumn.Beside,
				{
					enableScripts: true
				}
			);
			panel.webview.html = getWebviewContent(context);
			panel.webview.onDidReceiveMessage(async (message: any) => {
				if (message.command === 'chat') {
					const userPrompt = message.text;
					let responseText = '';

					try {
						const streamResponse = await ollama.chat({
							model: 'deepseek-r1:latest',
							messages: [{ role: 'user', content: userPrompt}],
							stream: true
						});

						for await (const part of streamResponse) {
							const filteredContent = filterThinkTags(part.message.content);
							if (filteredContent) {
								responseText += filteredContent + ' ';
							}
						}
						responseText = filterThinkTags(responseText);
						panel.webview.postMessage({ command: 'chatResponse', text: responseText.trim() });
					
					} catch (error) {
						panel.webview.postMessage({ command: 'chatResponse', text: `Error: ${String(error)}` });
					}
				}
			});
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to start Deep Seek Chat: ${String(error)}`);
		}
	});

	context.subscriptions.push(disposable);
}

// Deactivate the extension
export function deactivate() {}
