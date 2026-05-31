/**
 * INTERFACE SEGREGATION PRINCIPLE
 *
 * Segregated Interfaces - Each interface focuses on a single capability
 * Clients depend only on the methods they actually use
 */

// Basic printing capability
export interface Printable {
	print(document: string): boolean;
	getPrinterStatus(): string;
}

// Document scanning capability
export interface Scannable {
	scan(): string;
	getScannerStatus(): string;
}

// Faxing capability
export interface Faxable {
	fax(phoneNumber: string, document: string): boolean;
	getFaxStatus(): string;
}

// Copying capability
export interface Copyable {
	copy(sourceDocument: string): boolean;
}

// Finishing capability
export interface Finishable {
	staple(): boolean;
	collate(): boolean;
}
