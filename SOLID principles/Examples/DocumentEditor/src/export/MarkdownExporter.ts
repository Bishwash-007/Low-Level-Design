import { IExporter } from './IExporter';
import { IDocument } from '../core/IDocument';

// TODO: Implement MarkdownExporter
// - Export document content as Markdown
// - Include metadata as frontmatter
// - Return as string

export class MarkdownExporter implements IExporter {
	async export(document: IDocument): Promise<string> {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	getFileExtension(): string {
		return 'md';
	}

	getMimeType(): string {
		return 'text/markdown';
	}
}
