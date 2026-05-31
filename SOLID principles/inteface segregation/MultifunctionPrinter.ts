import { Printable, Scannable, Copyable, Finishable } from './Interfaces';

/**
 * MultifunctionPrinter Implementation
 *
 * ISP Compliant: Implements all relevant interfaces
 * But only because this device actually supports all these operations
 * Not forced to implement capabilities it doesn't have
 */

export class MultifunctionPrinter
	implements Printable, Scannable, Copyable, Finishable
{
	private tonerLevel: number = 100;
	private paperLevel: number = 500;
	private stapleCount: number = 0;
	private readonly model: string = 'Ricoh MP C3004';

	// Printable interface
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
		return `${this.model} - Toner: ${this.tonerLevel}%, Paper: ${this.paperLevel}`;
	}

	// Scannable interface
	scan(): string {
		console.log(' Scanned document');
		return `scan-${Date.now()}`;
	}

	getScannerStatus(): string {
		return `${this.model} - Scanner ready`;
	}

	// Copyable interface
	copy(sourceDocument: string): boolean {
		if (this.paperLevel < 1) {
			console.log(' Out of paper - cannot copy');
			return false;
		}

		if (this.tonerLevel < 5) {
			console.log(' Low toner - cannot copy');
			return false;
		}

		this.paperLevel--;
		this.tonerLevel -= 5;
		console.log(` Copied: "${sourceDocument}"`);
		return true;
	}

	// Finishable interface
	staple(): boolean {
		console.log(' Stapled documents');
		this.stapleCount++;
		return true;
	}

	collate(): boolean {
		console.log(' Collated documents');
		return true;
	}

	// Utility methods
	refillToner(): void {
		this.tonerLevel = 100;
		console.log(' Toner refilled');
	}

	restockPaper(sheets: number): void {
		this.paperLevel += sheets;
		console.log(` Paper restocked. Total: ${this.paperLevel}`);
	}

	getModel(): string {
		return this.model;
	}

	getStatus(): string {
		return `${this.model}\n  Toner: ${this.tonerLevel}%\n  Paper: ${this.paperLevel}\n  Staples used: ${this.stapleCount}`;
	}
}
