// Basic usage example - Shows how to use the Document Editor
// This is a reference for how the API should work once implemented

import {
	Document,
	Editor,
	FileSystemStorage,
	UndoRedoManager,
	InsertCommand,
	DeleteCommand,
	BoldFormatter,
	MarkdownExporter,
} from '../src/index';

// TODO: Complete this example once implementations are done
async function main() {
	// Setup dependencies
	const storage = new FileSystemStorage('./documents');
	const undoRedoManager = new UndoRedoManager();
	const editor = new Editor(storage, undoRedoManager);

	// Create a document
	const doc = await editor.createDocument('My Article');

	// Insert text using command
	const insertCmd = new InsertCommand(doc, 0, 'Hello World');
	editor.executeCommand(insertCmd);

	// Format text
	const boldFormatter = new BoldFormatter();
	const formatted = boldFormatter.format('Hello');

	// Save document
	await editor.saveDocument(doc);

	// Undo last operation
	editor.undo();

	// Export to Markdown
	const exporter = new MarkdownExporter();
	const markdown = await editor.exportDocument(doc, exporter);
	console.log(markdown);
}

// main().catch(console.error);
