import { Printable, Scannable, Copyable, Finishable } from './Interfaces';

/**
 * DocumentProcessingCenter
 *
 * ISP Demonstration: Uses multiple segregated interfaces
 * Each method depends only on the interface it needs
 */

export class DocumentProcessingCenter {
	private scanners: Scannable[] = [];
	private printers: Printable[] = [];
	private copiers: Copyable[] = [];
	private finishers: Finishable[] = [];

	addScanner(scanner: Scannable): void {
		this.scanners.push(scanner);
		console.log(` Scanner added. Total: ${this.scanners.length}`);
	}

	addPrinter(printer: Printable): void {
		this.printers.push(printer);
		console.log(` Printer added. Total: ${this.printers.length}`);
	}

	addCopier(copier: Copyable): void {
		this.copiers.push(copier);
		console.log(` Copier added. Total: ${this.copiers.length}`);
	}

	addFinisher(finisher: Finishable): void {
		this.finishers.push(finisher);
		console.log(` Finisher added. Total: ${this.finishers.length}`);
	}

	/**
	 * Scan a document
	 * Only depends on Scannable interface
	 */
	scanDocument(): string {
		if (this.scanners.length === 0) {
			throw new Error('No scanner available');
		}

		const scanner = this.scanners[0];
		const result = scanner.scan();
		console.log(`Status: ${scanner.getScannerStatus()}`);
		return result;
	}

	/**
	 * Print a document
	 * Only depends on Printable interface
	 */
	printDocument(document: string): boolean {
		if (this.printers.length === 0) {
			throw new Error('No printer available');
		}

		const printer = this.printers[0];
		const success = printer.print(document);
		console.log(`Status: ${printer.getPrinterStatus()}`);
		return success;
	}

	/**
	 * Copy a document
	 * Only depends on Copyable interface
	 */
	copyDocument(sourceDoc: string): boolean {
		if (this.copiers.length === 0) {
			throw new Error('No copier available');
		}

		const copier = this.copiers[0];
		const success = copier.copy(sourceDoc);
		return success;
	}

	/**
	 * Finalize documents
	 * Only depends on Finishable interface
	 */
	finalizeDocuments(): void {
		if (this.finishers.length === 0) {
			throw new Error('No finisher available');
		}

		const finisher = this.finishers[0];
		finisher.staple();
		finisher.collate();
	}

	/**
	 * Process different job types
	 */
	processJob(jobType: 'print' | 'scan' | 'copy' | 'finalize'): void {
		console.log(`\n--- Processing ${jobType} job ---`);

		try {
			switch (jobType) {
				case 'print':
					this.printDocument('report.pdf');
					break;
				case 'scan':
					this.scanDocument();
					break;
				case 'copy':
					this.copyDocument('original-doc.docx');
					break;
				case 'finalize':
					this.finalizeDocuments();
					break;
			}
		} catch (error) {
			console.error(` Error: ${(error as Error).message}`);
		}
	}

	getScannerCount(): number {
		return this.scanners.length;
	}

	getPrinterCount(): number {
		return this.printers.length;
	}

	getCopierCount(): number {
		return this.copiers.length;
	}

	getFinisherCount(): number {
		return this.finishers.length;
	}
}
