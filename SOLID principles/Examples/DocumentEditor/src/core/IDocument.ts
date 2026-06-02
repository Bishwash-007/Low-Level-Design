// Document Interface - Define what a document should do
export interface Metadata {
	title: string;
	author: string;
	createdAt: Date;
	lastModifiedAt: Date;
}

export interface IDocument {
	getContent(): string;
	setContent(content: string): void;
	getMetadata(): Metadata;
	setMetadata(metadata: Partial<Metadata>): void;
	getId(): string;
}
