import { Scannable } from './Interfaces';

/**
 * BarcodeScanner Implementation
 *
 * ISP Advantage: New implementation that only implements Scannable
 * No changes needed to existing code!
 * Can be added to DocumentProcessingCenter immediately
 */

export class BarcodeScanner implements Scannable {
	private readonly model: string = 'Symbol DS3478';

	scan(): string {
		const barcode = `BARCODE-${Math.floor(Math.random() * 1000000)}`;
		console.log(` Scanned barcode: ${barcode}`);
		return barcode;
	}

	getScannerStatus(): string {
		return `${this.model} - Ready`;
	}
}
