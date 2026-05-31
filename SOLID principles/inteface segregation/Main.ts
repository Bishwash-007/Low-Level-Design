/**
 * INTERFACE SEGREGATION PRINCIPLE - Complete Example
 *
 * Demonstrates how ISP enables flexible, maintainable systems:
 * - Clients depend only on interfaces they use
 * - No forced implementation of unused methods
 * - Easy to add new device types
 * - Perfect composition of capabilities
 */

import { Printable, Scannable, Copyable, Finishable } from './Interfaces';
import { BasicPrinter } from './BasicPrinter';
import { FaxMachine } from './FaxMachine';
import { Copier } from './Copier';
import { MultifunctionPrinter } from './MultifunctionPrinter';
import { BarcodeScanner } from './BarcodeScanner';
import { PrintJobHandler } from './PrintJobHandler';
import { DocumentProcessingCenter } from './DocumentProcessingCenter';

function main() {
	console.log('\n');
	console.log('   INTERFACE SEGREGATION PRINCIPLE');
	console.log('   Printer Management System Demo');
	console.log('');

	//  DEMONSTRATION 1: Individual Devices
	console.log(
		'\n 1 INDIVIDUAL DEVICES - Each implements only what it supports\n',
	);

	const basicPrinter = new BasicPrinter();
	const faxMachine = new FaxMachine();
	const copier = new Copier();
	const multifunction = new MultifunctionPrinter();

	console.log('--- Basic Printer (Only Printable) ---');
	basicPrinter.print('document.pdf');
	console.log(basicPrinter.getPrinterStatus());

	console.log('\n--- Fax Machine (Faxable + Scannable) ---');
	faxMachine.fax('555-1234', 'contract.pdf');
	faxMachine.scan();
	console.log(faxMachine.getFaxStatus());

	console.log('\n--- Copier (Copyable + Scannable) ---');
	copier.copy('original.doc');
	copier.scan();
	console.log(copier.getScannerStatus());

	console.log(
		'\n--- Multifunction (Printable + Scannable + Copyable + Finishable) ---',
	);
	multifunction.print('report.pdf');
	multifunction.scan();
	multifunction.copy('document.doc');
	multifunction.staple();
	multifunction.collate();
	console.log(multifunction.getStatus());

	//  DEMONSTRATION 2: Print Job Handler
	console.log('\n 2  PRINT JOB HANDLER - Uses only Printable interface\n');

	const handler1 = new PrintJobHandler(basicPrinter);
	handler1.submitPrintJob('letter.pdf');

	const handler2 = new PrintJobHandler(multifunction);
	handler2.submitPrintJob('invoice.pdf');

	console.log('\n PrintJobHandler works with ANY Printable device');
	console.log(" Handler doesn't know about scanning, copying, faxing");
	console.log(' This is the power of Interface Segregation!');

	//  DEMONSTRATION 3: Document Processing Center
	console.log(
		'\n 3 DOCUMENT PROCESSING CENTER - Uses segregated interfaces\n',
	);

	const center = new DocumentProcessingCenter();

	console.log('--- Setting up the center ---');
	center.addPrinter(basicPrinter);
	center.addPrinter(multifunction);
	center.addScanner(faxMachine);
	center.addScanner(copier);
	center.addScanner(multifunction);
	center.addCopier(copier);
	center.addCopier(multifunction);
	center.addFinisher(multifunction);

	console.log(`\nDevice inventory:`);
	console.log(`  Printers: ${center.getPrinterCount()}`);
	console.log(`  Scanners: ${center.getScannerCount()}`);
	console.log(`  Copiers: ${center.getCopierCount()}`);
	console.log(`  Finishers: ${center.getFinisherCount()}`);

	console.log('\n--- Processing Jobs ---');
	center.processJob('print');
	center.processJob('scan');
	center.processJob('copy');
	center.processJob('finalize');

	//  DEMONSTRATION 4: Adding New Device Type
	console.log(
		'\n\ 4  NEW DEVICE TYPE - BarcodeScanner (extends without changes)\n',
	);

	const barcodeScanner = new BarcodeScanner();
	console.log('Adding BarcodeScanner to center...');
	center.addScanner(barcodeScanner);
	console.log(`Total scanners now: ${center.getScannerCount()}`);

	console.log('\nUsing new scanner:');
	center.processJob('scan');
	console.log(' No changes to existing code needed!');

	//  DEMONSTRATION 5: ISP Benefits
	console.log('\n\ 5  KEY ISP BENEFITS\n');

	console.log(' No Forced Implementations');
	console.log("  - BasicPrinter doesn't implement Scannable");
	console.log('  - No "throw new Error(\'Not supported\')" methods');

	console.log('\n Flexible Composition');
	console.log('  - Devices implement only what they support');
	console.log('  - Easy to combine capabilities (e.g., Scannable + Copyable)');

	console.log('\n Client-Specific Interfaces');
	console.log('  - PrintJobHandler depends only on Printable');
	console.log("  - Changes to Scannable don't affect PrintJobHandler");

	console.log('\n Easy to Extend');
	console.log('  - New device types (BarcodeScanner) work immediately');
	console.log('  - No modifications to existing services');

	console.log('\n Better Testing');
	console.log('  - Create focused mock objects');
	console.log('  - Mock only needed interface');

	//  DEMONSTRATION 6: Comparison
	console.log('\n 6  ISP vs FAT INTERFACE\n');

	console.log(' WITHOUT ISP (Fat Interface Problem):');
	console.log('   interface Printer {');
	console.log('     print(): void;');
	console.log('     scan(): void;      // ← BasicPrinter throws error');
	console.log('     fax(): void;       // ← FaxMachine throws error');
	console.log('     copy(): void;      // ← Copier throws error');
	console.log('     staple(): void;    // ← Most devices throw error');
	console.log('   }');

	console.log('\n WITH ISP (Segregated Interfaces):');
	console.log('   interface Printable { print(): void; }');
	console.log('   interface Scannable { scan(): void; }');
	console.log('   interface Faxable { fax(): void; }');
	console.log('   interface Copyable { copy(): void; }');
	console.log('   interface Finishable { staple(): void; }');
	console.log('\n   Each class implements ONLY what it supports!');

	console.log('\n');
	console.log('   ISP: Clients depend only on what they use!');
	console.log('\n');
}

main();
