import { Printable } from './Interfaces';

/**
 * BasicPrinter Implementation
 *
 * ISP Compliant: Only implements Printable interface
 * No forced implementation of unused methods
 */

export class BasicPrinter implements Printable {
	private tonerLevel: number = 100;
	private readonly model: string = 'HP LaserJet';

	print(document: string): boolean {
		if (this.tonerLevel < 5) {
			console.log(' Low toner - cannot print');
			return false;
		}

		this.tonerLevel -= 5;
		console.log(` Printed: "${document}"`);
		return true;
	}

	getPrinterStatus(): string {
		return `${this.model} - Toner: ${this.tonerLevel}%`;
	}

	refillToner(): void {
		this.tonerLevel = 100;
		console.log(' Toner refilled');
	}

	getModel(): string {
		return this.model;
	}
}
