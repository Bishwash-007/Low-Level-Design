import { IFormatter } from './IFormatter';

// TODO: Implement ItalicFormatter
// - Apply italic formatting to text
// - Should follow IFormatter contract exactly

export class ItalicFormatter implements IFormatter {
	format(text: string): string {
		// TODO: Implement - return italic version (e.g., *text* or <i>text</i>)
		throw new Error('Method not implemented.');
	}

	getType(): string {
		return 'italic';
	}
}
