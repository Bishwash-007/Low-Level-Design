# Interface Segregation Principle (ISP) - Printer Management System

## Definition

The **Interface Segregation Principle** states that:

> **Clients should not be forced to depend on interfaces they do not use.**

This means:
- **Segregate Fat Interfaces**: Break large interfaces into smaller, focused ones
- **Client-Specific Interfaces**: Each client should depend only on the methods it actually needs
- **No Unused Methods**: Avoid forcing implementations to provide methods they don't need
- **Flexibility**: Easier to change interfaces without affecting clients that don't use them

## Why is ISP Important?

### 1. **Reduces Coupling**
Clients depend only on the methods they actually use, not on entire interfaces.

### 2. **Improves Flexibility**
Changes to one part of an interface don't break clients using other parts.

### 3. **Better Testability**
Smaller, focused interfaces are easier to mock and test.

### 4. **Easier Maintenance**
Each interface has a single, clear purpose, making code easier to understand.

### 5. **Prevents Forced Implementations**
Classes don't have to implement methods they don't use.

## How to Achieve ISP

### 1. **Identify Fat Interfaces**
Look for interfaces with methods not all implementations need.

### 2. **Segregate by Client**
Create smaller interfaces based on what clients actually need.

### 3. **Use Composition**
Combine multiple small interfaces when needed.

### 4. **Follow the Role Interface Pattern**
Create interfaces based on roles or responsibilities.

### 5. **Dependency Inversion**
Depend on abstractions, not on fat interfaces.

---

## Common ISP Violations

###  Violation 1: Fat Interface (Printer Example)

```typescript
// BAD - Fat interface forces all printers to implement everything
interface Printer {
  print(document: string): boolean;
  scan(): string;
  fax(phoneNumber: string): boolean;
  copy(): boolean;
  staple(): boolean;
}

// Basic printer forced to implement unused methods
class BasicPrinter implements Printer {
  print(document: string): boolean { /* ... */ }
  scan(): string { throw new Error("Not supported"); }
  fax(phoneNumber: string): boolean { throw new Error("Not supported"); }
  copy(): boolean { throw new Error("Not supported"); }
  staple(): boolean { throw new Error("Not supported"); }
}
```

**Problem**: BasicPrinter must implement methods it doesn't support!

###  Violation 2: Force Implementation of Unused Methods

```typescript
// BAD - Worker interface forces HR to implement payroll
interface Worker {
  work(): void;
  calculatePay(): number;
  reportIncident(): void;
  approveVacation(): boolean;
}

class ContractWorker implements Worker {
  work(): void { /* ... */ }
  calculatePay(): number { /* HR function */ }
  reportIncident(): void { /* ... */ }
  approveVacation(): boolean { /* Manager function */ }
}
```

**Problem**: ContractWorker shouldn't need to approve vacations!

###  Violation 3: Unnecessary Dependency

```typescript
// BAD - OrderProcessor depends on unused methods
interface PaymentProcessor {
  processPayment(amount: number): boolean;
  getTransactionHistory(): Transaction[];
  refund(transactionId: string): boolean;
  generateReport(): string; // Reporting, not needed by OrderProcessor
}

class OrderProcessor {
  private paymentProcessor: PaymentProcessor;

  processOrder(order: Order): void {
    // Only uses processPayment, but depends on entire interface
    this.paymentProcessor.processPayment(order.total);
  }
}
```

**Problem**: OrderProcessor is coupled to reporting features it doesn't use!

---

## Printer Management System Architecture

### System Overview

```
BEFORE ISP (BAD - Fat Interface):
┌─────────────────────────┐
│  Printer (Fat)          │
│  - print()              │
│  - scan()               │
│  - fax()                │
│  - copy()               │
│  - staple()             │
└─────────────────────────┘
        ↑
        ├─ BasicPrinter (forced to throw errors)
        ├─ FaxMachine (doesn't need printing)
        └─ Copier (doesn't need faxing)

AFTER ISP (GOOD - Segregated Interfaces):
┌────────────────┐    ┌────────────────┐    ┌────────────────┐
│ Printable      │    │ Scannable      │    │ Faxable        │
│ - print()      │    │ - scan()       │    │ - fax()        │
└────────────────┘    └────────────────┘    └────────────────┘
        ↑                       ↑                    ↑
        │              ┌────────┴───────┐          │
        │              │                │          │
        │          ┌─────────┐    ┌──────────┐  ┌─────────┐
        └──────────┤Multifunction├──┤BasicPrinter├──┤FaxMachine
                   └─────────┘    └──────────┘  └─────────┘
```

### Segregated Interfaces (ISP Compliant)

Each interface focuses on a single capability:

```typescript
// Basic printing capability
interface Printable {
  print(document: string): boolean;
  getPrinterStatus(): string;
}

// Document scanning capability
interface Scannable {
  scan(): string;
  getScannerStatus(): string;
}

// Faxing capability
interface Faxable {
  fax(phoneNumber: string, document: string): boolean;
  getFaxStatus(): string;
}

// Copying capability
interface Copyable {
  copy(sourceDocument: string): boolean;
}

// Finishing capability
interface Finishable {
  staple(): boolean;
  collate(): boolean;
}
```

**Benefits**:
- BasicPrinter only implements Printable
- FaxMachine only implements Faxable and Scannable
- Multifunction implements all that it supports
- No forced implementations of unused methods

---

## ISP-Compliant Printer Management System

### Base Interfaces

```typescript
// Segregated by responsibility - each client uses only what it needs
export interface Printable {
  print(document: string): boolean;
  getPrinterStatus(): string;
}

export interface Scannable {
  scan(): string;
  getScannerStatus(): string;
}

export interface Faxable {
  fax(phoneNumber: string, document: string): boolean;
  getFaxStatus(): string;
}

export interface Copyable {
  copy(sourceDocument: string): boolean;
}

export interface Finishable {
  staple(): boolean;
  collate(): boolean;
}
```

### Printer Implementations

```typescript
// 1. Basic Printer - Only implements Printable
export class BasicPrinter implements Printable {
  private tonerLevel: number = 100;

  print(document: string): boolean {
    if (this.tonerLevel < 5) {
      console.log("Low toner!");
      return false;
    }
    this.tonerLevel -= 5;
    console.log(` Printed: ${document}`);
    return true;
  }

  getPrinterStatus(): string {
    return `Toner: ${this.tonerLevel}%`;
  }
}

// 2. Fax Machine - Implements Faxable and Scannable
export class FaxMachine implements Faxable, Scannable {
  private faxQueue: number = 0;

  fax(phoneNumber: string, document: string): boolean {
    console.log(` Faxing "${document}" to ${phoneNumber}`);
    this.faxQueue++;
    return true;
  }

  getFaxStatus(): string {
    return `Faxes in queue: ${this.faxQueue}`;
  }

  scan(): string {
    console.log(" Scanned document");
    return "scanned-document-001";
  }

  getScannerStatus(): string {
    return "Scanner ready";
  }
}

// 3. Copier - Implements Copyable and Scannable
export class Copier implements Copyable, Scannable {
  private paperLevel: number = 500;

  copy(sourceDocument: string): boolean {
    if (this.paperLevel < 1) {
      console.log("Out of paper!");
      return false;
    }
    this.paperLevel--;
    console.log(` Copied: ${sourceDocument}`);
    return true;
  }

  scan(): string {
    console.log(" Scanned for copying");
    return "scanned-copy";
  }

  getScannerStatus(): string {
    return `Paper: ${this.paperLevel} sheets`;
  }
}

// 4. Multifunction Printer - Implements all relevant interfaces
export class MultifunctionPrinter
  implements Printable, Scannable, Copyable, Finishable {
  private tonerLevel: number = 100;
  private paperLevel: number = 500;

  print(document: string): boolean {
    if (this.tonerLevel < 5) return false;
    this.tonerLevel -= 5;
    console.log(` Printed: ${document}`);
    return true;
  }

  getPrinterStatus(): string {
    return `Toner: ${this.tonerLevel}%`;
  }

  scan(): string {
    console.log(" Scanned document");
    return "scanned-doc";
  }

  getScannerStatus(): string {
    return "Scanner ready";
  }

  copy(sourceDocument: string): boolean {
    if (this.paperLevel < 1) return false;
    this.paperLevel--;
    console.log(` Copied: ${sourceDocument}`);
    return true;
  }

  staple(): boolean {
    console.log(" Stapled documents");
    return true;
  }

  collate(): boolean {
    console.log(" Collated documents");
    return true;
  }
}
```

---

## Client Code Using Segregated Interfaces

### Print Job Handler - Depends Only on Printable

```typescript
export class PrintJobHandler {
  private printer: Printable;

  constructor(printer: Printable) {
    this.printer = printer;
  }

  submitPrintJob(document: string): void {
    // Only depends on Printable interface
    if (this.printer.print(document)) {
      console.log(`Print job completed`);
      console.log(`Status: ${this.printer.getPrinterStatus()}`);
    }
  }

  // PrintJobHandler DOESN'T KNOW about scanning, faxing, copying
  // This is the power of ISP!
}
```

### Document Processing Center - Depends on Multiple Segregated Interfaces

```typescript
export class DocumentProcessingCenter {
  private scanners: Scannable[] = [];
  private printers: Printable[] = [];
  private copiers: Copyable[] = [];

  addScanner(scanner: Scannable): void {
    this.scanners.push(scanner);
  }

  addPrinter(printer: Printable): void {
    this.printers.push(printer);
  }

  addCopier(copier: Copyable): void {
    this.copiers.push(copier);
  }

  // Each method depends only on the interface it needs
  scanDocument(): string {
    const scanner = this.scanners[0];
    if (scanner) {
      const result = scanner.scan();
      console.log(scanner.getScannerStatus());
      return result;
    }
    throw new Error("No scanner available");
  }

  printDocument(document: string): void {
    const printer = this.printers[0];
    if (printer) {
      printer.print(document);
      console.log(printer.getPrinterStatus());
    } else {
      throw new Error("No printer available");
    }
  }

  copyDocument(sourceDoc: string): void {
    const copier = this.copiers[0];
    if (copier) {
      copier.copy(sourceDoc);
    } else {
      throw new Error("No copier available");
    }
  }

  processJob(jobType: string): void {
    if (jobType === "print") {
      this.printDocument("report.pdf");
    } else if (jobType === "scan") {
      this.scanDocument();
    } else if (jobType === "copy") {
      this.copyDocument("document.doc");
    }
  }
}
```

---

## ISP in Action

### Example: Adding New Device Type

```typescript
// NEW: Barcode Scanner - Only implements Scannable
// NO changes needed to existing code!
export class BarcodeScanner implements Scannable {
  scan(): string {
    console.log(" Scanned barcode");
    return "barcode-123456";
  }

  getScannerStatus(): string {
    return "Barcode scanner ready";
  }
}

// Just add it to the processing center - it works!
const center = new DocumentProcessingCenter();
center.addScanner(new BarcodeScanner());
center.scanDocument(); // Works without any modifications
```

### Example: Testing with Mock Objects

```typescript
// Mock printer for testing - only implements what's needed
class MockPrinter implements Printable {
  printCount = 0;

  print(document: string): boolean {
    this.printCount++;
    return true;
  }

  getPrinterStatus(): string {
    return "Mock: OK";
  }
}

// Works perfectly with PrintJobHandler
const handler = new PrintJobHandler(new MockPrinter());
handler.submitPrintJob("test");
```

---

## Benefits Demonstrated

### 1. **No Forced Implementations**

```typescript
//  BasicPrinter only implements Printable
export class BasicPrinter implements Printable {
  // Only needs to implement print() and getPrinterStatus()
  print(document: string): boolean { /* ... */ }
  getPrinterStatus(): string { /* ... */ }
  // No throw new Error("Not supported")!
}
```

### 2. **Flexible Composition**

```typescript
// Same interface can be used by multiple different devices
const devices: Scannable[] = [
  new MultifunctionPrinter(),
  new FaxMachine(),
  new Copier(),
  new BarcodeScanner()  // NEW - all work together
];

devices.forEach(device => device.scan());
```

### 3. **Easy to Test**

```typescript
// Mock only what you need
class TestPrinter implements Printable {
  print(document: string): boolean { return true; }
  getPrinterStatus(): string { return "OK"; }
}

const handler = new PrintJobHandler(new TestPrinter());
// Clean, simple, no unnecessary methods
```

### 4. **Loose Coupling**

```typescript
// PrintJobHandler doesn't know about Scannable, Copyable, Faxable
// Changes to those interfaces don't affect PrintJobHandler
export class PrintJobHandler {
  constructor(private printer: Printable) {}
  // Depends on ONE focused interface
}
```

### 5. **Client-Specific Interfaces**

```typescript
// Each client gets exactly what it needs
export class MailRoom {
  // Only depends on printing capability
  constructor(private printer: Printable) {}
}

export class ScanningDepartment {
  // Only depends on scanning capability
  constructor(private scanner: Scannable) {}
}

export class ShippingDepartment {
  // Only depends on copying capability
  constructor(private copier: Copyable) {}
}
```

---

## ISP Violations to Avoid

###  Bad: Fat Interface

```typescript
// VIOLATES ISP - combines unrelated responsibilities
interface Office {
  print(): void;
  scan(): void;
  fax(): void;
  copy(): void;
  staple(): void;
  bindDocuments(): void;
  shred(): void;
}
```

###  Bad: Forced Methods

```typescript
// VIOLATES ISP - BasicScanner forced to implement print()
class BasicScanner implements Office {
  print(): void { throw new Error("Not supported"); }
  scan(): void { /* ... */ }
  fax(): void { throw new Error("Not supported"); }
  copy(): void { throw new Error("Not supported"); }
  staple(): void { throw new Error("Not supported"); }
  bindDocuments(): void { throw new Error("Not supported"); }
  shred(): void { throw new Error("Not supported"); }
}
```

###  Bad: Client Coupling

```typescript
// VIOLATES ISP - Client depends on methods it doesn't use
class PrintShop {
  constructor(private office: Office) {}

  printDocument(doc: string): void {
    this.office.print(doc); // Only uses one method!
    // But is coupled to all other methods
  }
}
```

---

## Summary

### ISP Ensures:
 Clients depend only on interfaces they use  
 No forced implementations of unused methods  
 Smaller, more focused interfaces  
 Easier to test with mocks  
 Flexible composition of capabilities  
 Changes don't break unrelated clients  

### Remember:
> **"Many client-specific interfaces are better than one general-purpose interface."**

By following ISP, you create flexible, maintainable systems where each component only depends on what it actually needs.
