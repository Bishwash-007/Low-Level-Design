import { IStorage } from './IStorage';
import { IDocument } from '../core/IDocument';

// TODO: Implement FileSystemStorage
// - Save documents to local file system
// - Load documents from file system
// - Serialize/deserialize JSON
// - Implements IStorage interface

export class FileSystemStorage implements IStorage {
	constructor(private baseDirectory: string = './documents') {}

	async save(document: IDocument): Promise<void> {
		// TODO: Implement - serialize document to JSON and save to file
		throw new Error('Method not implemented.');
	}

	async load(documentId: string): Promise<IDocument> {
		// TODO: Implement - load document from file and deserialize
		throw new Error('Method not implemented.');
	}

	async delete(documentId: string): Promise<void> {
		// TODO: Implement - delete document file
		throw new Error('Method not implemented.');
	}

	async exists(documentId: string): Promise<boolean> {
		// TODO: Implement - check if document file exists
		throw new Error('Method not implemented.');
	}
}
