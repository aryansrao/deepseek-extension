import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('the chat command has a discoverable title', () => {
		const manifestPath = path.resolve(__dirname, '../../package.json');
		const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
		const command = manifest.contributes.commands.find((item: { command: string }) => item.command === 'deep-seek.start');

		assert.ok(command, 'the chat command should be contributed');
		assert.strictEqual(command.title, 'Open DeepSeek Chat');
	});
});
