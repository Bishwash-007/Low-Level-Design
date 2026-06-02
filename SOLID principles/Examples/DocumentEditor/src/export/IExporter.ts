import { IDocument } from '../core/IDocument';

// Exporter Interface - Export to different formats (LSP)
// All exporters follow same contract
// Can be swapped at runtime

export interface IExporter {
	export(document: IDocument): Promise<string | Buffer>;
	getFileExtension(): string;
	getMimeType(): string;
}
