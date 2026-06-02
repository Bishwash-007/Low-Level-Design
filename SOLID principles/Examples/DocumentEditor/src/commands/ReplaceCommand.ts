import { ICommand } from './ICommand';
import { IDocument } from '../core/IDocument';

// TODO: Implement ReplaceCommand
// - Replace text from start to end with new text
// - Store previous content for undo
// - Can be composition of DeleteCommand + InsertCommand

export class ReplaceCommand implements ICommand {
	private previousContent: string = '';

	constructor(
		private document: IDocument,
		private startPosition: number,
		private endPosition: number,
		private newText: string,
	) {}

	execute(): void {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	undo(): void {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	getDescription(): string {
		return `Replace text from position ${this.startPosition} to ${this.endPosition}`;
	}
}
