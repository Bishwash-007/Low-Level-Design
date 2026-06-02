import { IExporter } from './IExporter';
import { IDocument } from '../core/IDocument';

// TODO: Implement HTMLExporter
// - Export document content as HTML
// - Include styling
// - Return as string

export class HTMLExporter implements IExporter {
	async export(document: IDocument): Promise<string> {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	getFileExtension(): string {
		return 'html';
	}

	getMimeType(): string {
		return 'text/html';
	}
}
