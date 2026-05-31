# Polymorphism in OOP

## What is Polymorphism?

Polymorphism means **"many forms"**. It's the ability of an object to take multiple forms or the ability to perform the same operation in different ways. Polymorphism allows you to write code that can work with objects of different types.

## Real-World Analogy

Think of a **Drive Method**:
- A car driver knows how to "drive"
- When driving a car, bus, truck, or motorcycle, the method is the same ("drive")
- But the internal implementation is different for each vehicle
- The driver doesn't need to know the specific details - just call "drive()"

Similarly, in code, you can have one interface that different classes implement in their own ways.

## Key Concept

**Polymorphism = One Interface, Multiple Implementations**

## Types of Polymorphism

### 1. **Compile-time Polymorphism (Method Overloading)**

Method overloading means having **multiple methods with the same name but different parameters**.

```typescript
class Calculator {
  // Method overloading in TypeScript using union types or optional parameters
  
  add(a: number, b: number): number;
  add(a: number, b: number, c: number): number;
  add(a: number, b: number, c?: number): number {
    if (c !== undefined) {
      return a + b + c;
    }
    return a + b;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 10));      // 15
console.log(calc.add(5, 10, 15));  // 30
```

**Note**: True method overloading (like in Java) isn't directly supported in TypeScript, but you can achieve similar behavior with union types or function overloads.

### 2. **Runtime Polymorphism (Method Overriding)**

A child class **overrides** a parent class method with its own implementation.

```typescript
class Shape {
  draw(): void {
    console.log("Drawing a shape");
  }
}

class Circle extends Shape {
  draw(): void {
    console.log("Drawing a circle");
  }
}

class Rectangle extends Shape {
  draw(): void {
    console.log("Drawing a rectangle");
  }
}

// Polymorphism in action
function renderShape(shape: Shape): void {
  shape.draw(); // Same method, different behavior
}

const circle = new Circle();
const rectangle = new Rectangle();

renderShape(circle);    // Drawing a circle
renderShape(rectangle); // Drawing a rectangle
```

## Method Overriding Example

```typescript
// Parent class
class Animal {
  speak(): string {
    return "Some generic sound";
  }

  move(): string {
    return "Moving...";
  }
}

// Different implementations
class Dog extends Animal {
  speak(): string {
    return "Woof! Woof!";
  }

  // move() is inherited (not overridden)
}

class Cat extends Animal {
  speak(): string {
    return "Meow!";
  }

  move(): string {
    return "Jumping...";
  }
}

class Bird extends Animal {
  speak(): string {
    return "Tweet! Tweet!";
  }

  move(): string {
    return "Flying...";
  }
}

// Polymorphic behavior
function animalConcert(animals: Animal[]): void {
  for (const animal of animals) {
    console.log(animal.speak()); // Each calls its own version
    console.log(animal.move());
  }
}

const animals: Animal[] = [
  new Dog(),
  new Cat(),
  new Bird()
];

animalConcert(animals);
// Output:
// Woof! Woof!
// Moving...
// Meow!
// Jumping...
// Tweet! Tweet!
// Flying...
```

## Practical Example: Payment Processing System

```typescript
// Abstract parent class - defines contract
abstract class PaymentProcessor {
  abstract processPayment(amount: number): boolean;
  abstract refund(amount: number): boolean;
  abstract getProcessingFee(amount: number): number;

  // Common method
  printReceipt(amount: number): void {
    console.log(`Payment of $${amount} processed successfully`);
  }
}

// Credit Card implementation
class CreditCardProcessor extends PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing credit card payment: $${amount}`);
    // Simulate processing
    return true;
  }

  refund(amount: number): boolean {
    console.log(`Refunding credit card: $${amount}`);
    return true;
  }

  getProcessingFee(amount: number): number {
    return amount * 0.02; // 2% fee
  }
}

// PayPal implementation
class PayPalProcessor extends PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing PayPal payment: $${amount}`);
    // Simulate processing
    return true;
  }

  refund(amount: number): boolean {
    console.log(`Refunding via PayPal: $${amount}`);
    return true;
  }

  getProcessingFee(amount: number): number {
    return amount * 0.03 + 0.30; // 3% + $0.30
  }
}

// Stripe implementation
class StripeProcessor extends PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing Stripe payment: $${amount}`);
    // Simulate processing
    return true;
  }

  refund(amount: number): boolean {
    console.log(`Refunding via Stripe: $${amount}`);
    return true;
  }

  getProcessingFee(amount: number): number {
    return amount * 0.029 + 0.30; // 2.9% + $0.30
  }
}

// Client code - works with any processor
class PaymentService {
  private processor: PaymentProcessor;

  constructor(processor: PaymentProcessor) {
    this.processor = processor;
  }

  makePayment(amount: number): void {
    if (this.processor.processPayment(amount)) {
      const fee = this.processor.getProcessingFee(amount);
      this.processor.printReceipt(amount);
      console.log(`Processing fee: $${fee.toFixed(2)}`);
    }
  }

  refund(amount: number): void {
    if (this.processor.refund(amount)) {
      console.log(`Refund completed for $${amount}`);
    }
  }
}

// Usage - polymorphism in action
const creditCard = new CreditCardProcessor();
const paypal = new PayPalProcessor();
const stripe = new StripeProcessor();

const paymentAmount = 100;

// Same client code works with different processors
const service1 = new PaymentService(creditCard);
service1.makePayment(paymentAmount);

const service2 = new PaymentService(paypal);
service2.makePayment(paymentAmount);

const service3 = new PaymentService(stripe);
service3.makePayment(paymentAmount);

// Output:
// Processing credit card payment: $100
// Payment of $100 processed successfully
// Processing fee: $2.00

// Processing PayPal payment: $100
// Payment of $100 processed successfully
// Processing fee: $3.30

// Processing Stripe payment: $100
// Payment of $100 processed successfully
// Processing fee: $3.29
```

## Interface-based Polymorphism

```typescript
// Define contract using interface
interface Logger {
  log(message: string): void;
}

// Different implementations
class FileLogger implements Logger {
  log(message: string): void {
    console.log(`[FILE] ${message}`);
  }
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[CONSOLE] ${message}`);
  }
}

class DatabaseLogger implements Logger {
  log(message: string): void {
    console.log(`[DATABASE] ${message}`);
  }
}

// Works with any logger
class Application {
  constructor(private logger: Logger) {}

  run(): void {
    this.logger.log("Application started");
    // Do some work
    this.logger.log("Application finished");
  }
}

// Usage
const app1 = new Application(new FileLogger());
const app2 = new Application(new ConsoleLogger());
const app3 = new Application(new DatabaseLogger());

app1.run(); // Uses FileLogger
app2.run(); // Uses ConsoleLogger
app3.run(); // Uses DatabaseLogger
```

## Practical Example: Notification System

```typescript
// Base abstraction
abstract class Notification {
  protected recipient: string;

  constructor(recipient: string) {
    this.recipient = recipient;
  }

  abstract send(message: string): boolean;
  abstract getDeliveryTime(): number; // in seconds
}

// Email implementation
class EmailNotification extends Notification {
  send(message: string): boolean {
    console.log(`Sending email to ${this.recipient}: "${message}"`);
    return true;
  }

  getDeliveryTime(): number {
    return 5; // 5 seconds
  }
}

// SMS implementation
class SMSNotification extends Notification {
  send(message: string): boolean {
    console.log(`Sending SMS to ${this.recipient}: "${message}"`);
    return true;
  }

  getDeliveryTime(): number {
    return 2; // 2 seconds
  }
}

// Push notification implementation
class PushNotification extends Notification {
  send(message: string): boolean {
    console.log(`Sending push notification to ${this.recipient}: "${message}"`);
    return true;
  }

  getDeliveryTime(): number {
    return 1; // 1 second
  }
}

// Client - works with any notification type
class NotificationManager {
  private notifications: Notification[] = [];

  addNotification(notification: Notification): void {
    this.notifications.push(notification);
  }

  notifyAll(message: string): void {
    for (const notification of this.notifications) {
      notification.send(message);
    }
  }

  getSlowestDelivery(): number {
    let slowest = 0;
    for (const notification of this.notifications) {
      const time = notification.getDeliveryTime();
      if (time > slowest) {
        slowest = time;
      }
    }
    return slowest;
  }
}

// Usage
const manager = new NotificationManager();
manager.addNotification(new EmailNotification("user@email.com"));
manager.addNotification(new SMSNotification("+1234567890"));
manager.addNotification(new PushNotification("user123"));

manager.notifyAll("Hello! This is a test message");
console.log(`Slowest delivery: ${manager.getSlowestDelivery()} seconds`);

// Output:
// Sending email to user@email.com: "Hello! This is a test message"
// Sending SMS to +1234567890: "Hello! This is a test message"
// Sending push notification to user123: "Hello! This is a test message"
// Slowest delivery: 5 seconds
```

## Benefits of Polymorphism

### 1. **Flexibility**
```typescript
// Easy to add new implementations without changing existing code
interface DataStore {
  save(data: any): void;
  retrieve(id: string): any;
}

class MongoStore implements DataStore {
  save(data: any): void { console.log("Saving to MongoDB"); }
  retrieve(id: string): any { console.log("Retrieving from MongoDB"); return {}; }
}

class PostgresStore implements DataStore {
  save(data: any): void { console.log("Saving to PostgreSQL"); }
  retrieve(id: string): any { console.log("Retrieving from PostgreSQL"); return {}; }
}

// New store type - no changes needed to client code
class RedisStore implements DataStore {
  save(data: any): void { console.log("Saving to Redis"); }
  retrieve(id: string): any { console.log("Retrieving from Redis"); return {}; }
}
```

### 2. **Extensibility**
```typescript
// Easy to extend with new types
abstract class Report {
  abstract generate(): string;
  abstract export(format: string): void;
}

class PDFReport extends Report {
  generate(): string { return "PDF Report generated"; }
  export(format: string): void { console.log("Exporting as PDF"); }
}

class ExcelReport extends Report {
  generate(): string { return "Excel Report generated"; }
  export(format: string): void { console.log("Exporting as Excel"); }
}

// New report type is easy to add
class HTMLReport extends Report {
  generate(): string { return "HTML Report generated"; }
  export(format: string): void { console.log("Exporting as HTML"); }
}
```

### 3. **Maintainability**
```typescript
// Changes to one implementation don't affect others
class OldFileLogger {
  private logFile: string = "app.log";
  // Old implementation
}

// New implementation - better
class ModernFileLogger implements Logger {
  private logFile: string;
  private maxSize: number = 10 * 1024 * 1024; // 10MB

  constructor(logFile: string) {
    this.logFile = logFile;
  }

  log(message: string): void {
    // Better implementation with rotation
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
}
```

### 4. **Loose Coupling**
```typescript
// Classes don't depend on concrete implementations
class Order {
  private paymentProcessor: PaymentProcessor;
  private shippingService: any; // Generic

  constructor(paymentProcessor: PaymentProcessor) {
    this.paymentProcessor = paymentProcessor;
  }

  checkout(amount: number): boolean {
    return this.paymentProcessor.processPayment(amount);
  }
}

// Works with any PaymentProcessor implementation
```

## Method Resolution Order

TypeScript uses dynamic dispatch at runtime to determine which method to call:

```typescript
class Vehicle {
  getType(): string {
    return "Vehicle";
  }
}

class Car extends Vehicle {
  getType(): string {
    return "Car";
  }
}

class ElectricCar extends Car {
  getType(): string {
    return "Electric Car";
  }
}

// Runtime polymorphism
function printType(vehicle: Vehicle): void {
  console.log(vehicle.getType());
}

const v: Vehicle = new ElectricCar();
printType(v); // Output: Electric Car (not "Vehicle")
```

## Best Practices

 **Do:**
- Use polymorphism for extensibility
- Depend on abstractions, not concrete classes
- Override methods meaningfully
- Use interfaces for contracts
- Keep implementations focused

 **Don't:**
- Override methods without understanding parent behavior
- Create unnecessary polymorphic structures
- Use polymorphism for simple cases
- Ignore the Liskov Substitution Principle

## Key Takeaways

- **Polymorphism allows different implementations** of the same interface
- **Compile-time polymorphism** uses method overloading
- **Runtime polymorphism** uses method overriding
- **Same code works with different types** - highly flexible
- **Enables extensibility** without changing existing code
- **Promotes loose coupling** between classes

## Real-World Applications

- **Stream APIs**: InputStream  FileInputStream, ByteArrayInputStream
- **Collections**: List  ArrayList, LinkedList
- **Drivers**: Driver interface  DatabaseDriver, PrinterDriver
- **Frameworks**: Handler  RequestHandler, EventHandler
- **Plugins**: Plugin interface  different implementations
