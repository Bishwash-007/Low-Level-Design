import { IDocument } from '../core/IDocument';
import { IStorage } from '../storage/IStorage';
import { IUndoRedoManager } from '../undo-redo/IUndoRedoManager';
import { ICommand } from '../commands/ICommand';
import { IExporter } from '../export/IExporter';

// TODO: Implement Editor class
// - Facade that coordinates all components
// - High-level API for document operations
// - Depends on abstractions (IStorage, IUndoRedoManager, IExporter)
// - Does NOT depend on concrete implementations

export class Editor {
	constructor(
		private storage: IStorage,
		private undoRedoManager: IUndoRedoManager,
	) {}

	async createDocument(title: string): Promise<IDocument> {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	async openDocument(documentId: string): Promise<IDocument> {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	async saveDocument(document: IDocument): Promise<void> {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	executeCommand(command: ICommand): void {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	undo(): void {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	redo(): void {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	async exportDocument(
		document: IDocument,
		exporter: IExporter,
	): Promise<string | Buffer> {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}
}
