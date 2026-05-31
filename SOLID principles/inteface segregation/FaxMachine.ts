import { Faxable, Scannable } from './Interfaces';

/**
 * FaxMachine Implementation
 *
 * ISP Compliant: Implements Faxable and Scannable interfaces
 * Each interface is focused on what this device actually does
 */

export class FaxMachine implements Faxable, Scannable {
	private faxQueue: number = 0;
	private readonly model: string = 'Canon ImageFAX';

	fax(phoneNumber: string, document: string): boolean {
		console.log(` Faxing "${document}" to ${phoneNumber}`);
		this.faxQueue++;
		return true;
	}

	getFaxStatus(): string {
		return `Faxes in queue: ${this.faxQueue}`;
	}

	scan(): string {
		console.log(' Scanned document');
		return `scanned-${Date.now()}`;
	}

	getScannerStatus(): string {
		return `${this.model} - Scanner ready`;
	}

	reduceFaxQueue(): void {
		if (this.faxQueue > 0) {
			this.faxQueue--;
		}
	}

	getModel(): string {
		return this.model;
	}
}
