import { IDocument } from '../core/IDocument';

// Storage Interface - Abstracts persistence layer (DIP)
// Different implementations: File, Cloud, Database
// Editor depends on this interface, not concrete storage

export interface IStorage {
	save(document: IDocument): Promise<void>;
	load(documentId: string): Promise<IDocument>;
	delete(documentId: string): Promise<void>;
	exists(documentId: string): Promise<boolean>;
}
