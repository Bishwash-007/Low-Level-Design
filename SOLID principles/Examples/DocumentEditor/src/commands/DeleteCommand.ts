import { ICommand } from './ICommand';
import { IDocument } from '../core/IDocument';

// TODO: Implement DeleteCommand
// - Delete text from start to end position
// - Store deleted content for undo
// - Execute and undo should be inverses

export class DeleteCommand implements ICommand {
	private deletedContent: string = '';

	constructor(
		private document: IDocument,
		private startPosition: number,
		private endPosition: number,
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
		return `Delete from position ${this.startPosition} to ${this.endPosition}`;
	}
}
