import { Printable } from './Interfaces';

/**
 * PrintJobHandler
 *
 * ISP Demonstration: Client depends ONLY on Printable interface
 * Doesn't know about scanning, copying, faxing capabilities
 * This is the power of Interface Segregation!
 */

export class PrintJobHandler {
	private printer: Printable;

	constructor(printer: Printable) {
		this.printer = printer;
	}

	/**
	 * Submit a print job
	 * Only depends on Printable interface
	 */
	submitPrintJob(document: string): void {
		console.log(`\n--- Print Job Handler ---`);
		console.log(`Submitting: "${document}"`);

		if (this.printer.print(document)) {
			console.log(` Job completed`);
			console.log(`Status: ${this.printer.getPrinterStatus()}`);
		} else {
			console.log(` Job failed`);
		}
	}

	getPrinterStatus(): string {
		return this.printer.getPrinterStatus();
	}

	// PrintJobHandler DOESN'T HAVE METHODS FOR:
	// - scan()
	// - fax()
	// - copy()
	// - staple()
	// This is exactly what ISP requires!
}
