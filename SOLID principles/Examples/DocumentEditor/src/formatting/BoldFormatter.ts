import { IFormatter } from './IFormatter';

// TODO: Implement BoldFormatter
// - Apply bold formatting to text
// - Should follow IFormatter contract exactly

export class BoldFormatter implements IFormatter {
	format(text: string): string {
		// TODO: Implement - return bold version (e.g., **text** or <b>text</b>)
		throw new Error('Method not implemented.');
	}

	getType(): string {
		return 'bold';
	}
}
