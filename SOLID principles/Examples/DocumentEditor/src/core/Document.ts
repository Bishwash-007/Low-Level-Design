import { IDocument, Metadata } from './IDocument';

// TODO: Implement Document class
// - Store content
// - Manage metadata
// - No formatting or persistence logic here (SRP)

export class Document implements IDocument {
	private id: string;
	private content: string = '';
	private metadata: Metadata;

	constructor(id: string, title: string = 'Untitled Document') {
		this.id = id;
		this.metadata = {
			title,
			author: 'Anonymous',
			createdAt: new Date(),
			lastModifiedAt: new Date(),
		};
	}

	getContent(): string {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	setContent(content: string): void {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	getMetadata(): Metadata {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	setMetadata(metadata: Partial<Metadata>): void {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	getId(): string {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}
}
