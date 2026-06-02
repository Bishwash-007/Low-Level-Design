import { ICommand } from './ICommand';
import { IDocument } from '../core/IDocument';

// TODO: Implement InsertCommand
// - Insert text at position
// - Store previous content for undo
// - Execute and undo should be inverses

export class InsertCommand implements ICommand {
	private previousContent: string = '';

	constructor(
		private document: IDocument,
		private position: number,
		private text: string,
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
		return `Insert "${this.text}" at position ${this.position}`;
	}
}
