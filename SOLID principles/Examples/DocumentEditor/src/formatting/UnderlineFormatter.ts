import { IFormatter } from './IFormatter';

// TODO: Implement UnderlineFormatter
// - Apply underline formatting to text
// - Should follow IFormatter contract exactly

export class UnderlineFormatter implements IFormatter {
	format(text: string): string {
		// TODO: Implement - return underlined version
		throw new Error('Method not implemented.');
	}

	getType(): string {
		return 'underline';
	}
}
