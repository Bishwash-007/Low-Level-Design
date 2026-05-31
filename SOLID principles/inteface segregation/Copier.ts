import { Copyable, Scannable } from './Interfaces';

/**
 * Copier Implementation
 *
 * ISP Compliant: Implements Copyable and Scannable interfaces
 * Only depends on the capabilities it actually provides
 */

export class Copier implements Copyable, Scannable {
	private paperLevel: number = 500;
	private readonly model: string = 'Xerox WorkCentre';

	copy(sourceDocument: string): boolean {
		if (this.paperLevel < 1) {
			console.log(' Out of paper - cannot copy');
			return false;
		}

		this.paperLevel--;
		console.log(` Copied: "${sourceDocument}"`);
		return true;
	}

	scan(): string {
		console.log(' Scanned for copying');
		return `copy-scan-${Date.now()}`;
	}

	getScannerStatus(): string {
		return `${this.model} - Paper: ${this.paperLevel} sheets`;
	}

	restockPaper(sheets: number): void {
		this.paperLevel += sheets;
		console.log(` Restocked ${sheets} sheets. Total: ${this.paperLevel}`);
	}

	getModel(): string {
		return this.model;
	}
}
