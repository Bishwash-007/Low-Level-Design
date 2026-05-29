# Abstraction in OOP

## What is Abstraction?

Abstraction is the process of **hiding complex implementation details** and showing only the **essential features** of an object. It allows you to focus on what an object does rather than how it does it.

## Real-World Analogy

Think of a **TV Remote Control**:
- You only see buttons (essential features)
- You don't see the internal circuitry, signal transmission, or how it communicates with the TV (hidden complexity)
- You just press a button and the TV turns on/off (simple interface)

Similarly, in programming, you use a database without knowing exactly how data is stored internally.

## Key Concept

**Abstraction = Hiding "HOW" and Showing "WHAT"**

## Abstract Classes

An abstract class is a class that cannot be instantiated and may contain abstract methods (methods without implementation).

```typescript
// Define an abstract class
abstract class Vehicle {
  abstract accelerate(): void;
  abstract brake(): void;

  honk(): void {
    console.log("Beep beep!");
  }
}

// Implement the abstract class
class Car extends Vehicle {
  accelerate(): void {
    console.log("Car is accelerating");
  }

  brake(): void {
    console.log("Car is braking");
  }
}

// This works
const car = new Car();
car.accelerate(); // Car is accelerating
car.brake();      // Car is braking

// This would fail - cannot instantiate abstract class
// const vehicle = new Vehicle(); // Error
```

## Interfaces (Pure Abstraction)

An interface defines a contract that classes must follow. It only declares what methods/properties exist, not how they work.

```typescript
// Interface - pure abstraction
interface PaymentProcessor {
  processPayment(amount: number): boolean;
  refund(amount: number): void;
}

// Credit Card implementation
class CreditCardProcessor implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing credit card payment of $${amount}`);
    return true;
  }

  refund(amount: number): void {
    console.log(`Refunding $${amount} to credit card`);
  }
}

// PayPal implementation
class PayPalProcessor implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing PayPal payment of $${amount}`);
    return true;
  }

  refund(amount: number): void {
    console.log(`Refunding $${amount} to PayPal account`);
  }
}

// Usage
const processor1: PaymentProcessor = new CreditCardProcessor();
const processor2: PaymentProcessor = new PayPalProcessor();

processor1.processPayment(50); // Processing credit card payment of $50
processor2.processPayment(50); // Processing PayPal payment of $50
```

## Practical Example: Database

```typescript
// Abstract layer - user doesn't need to know the database details
interface Database {
  connect(): void;
  disconnect(): void;
  query(sql: string): any[];
  insert(data: any): boolean;
}

// MongoDB implementation
class MongoDatabase implements Database {
  connect(): void {
    console.log("Connecting to MongoDB");
  }

  disconnect(): void {
    console.log("Disconnecting from MongoDB");
  }

  query(sql: string): any[] {
    console.log("Executing MongoDB query");
    return [];
  }

  insert(data: any): boolean {
    console.log("Inserting document into MongoDB");
    return true;
  }
}

// MySQL implementation
class MySQLDatabase implements Database {
  connect(): void {
    console.log("Connecting to MySQL");
  }

  disconnect(): void {
    console.log("Disconnecting from MySQL");
  }

  query(sql: string): any[] {
    console.log("Executing SQL query");
    return [];
  }

  insert(data: any): boolean {
    console.log("Inserting record into MySQL");
    return true;
  }
}

// User's code - they don't know which database is used
class UserService {
  constructor(private database: Database) {}

  saveUser(user: any): boolean {
    return this.database.insert(user);
  }

  getUsers(): any[] {
    return this.database.query("SELECT * FROM users");
  }
}

// Usage - can easily switch databases
const mongoDb = new MongoDatabase();
const userService = new UserService(mongoDb);
userService.saveUser({ name: "John" }); // Inserting document into MongoDB

const mysqlDb = new MySQLDatabase();
const userService2 = new UserService(mysqlDb);
userService2.saveUser({ name: "Jane" }); // Inserting record into MySQL
```

## Benefits of Abstraction

### 1. **Simplicity**
```typescript
// User doesn't need to understand complex ATM internals
interface ATM {
  withdraw(amount: number): void;
  deposit(amount: number): void;
  checkBalance(): number;
}

class BankATM implements ATM {
  private balance: number = 1000;

  withdraw(amount: number): void {
    this.balance -= amount;
    console.log(`Withdrew $${amount}`);
  }

  deposit(amount: number): void {
    this.balance += amount;
    console.log(`Deposited $${amount}`);
  }

  checkBalance(): number {
    return this.balance;
  }
}

const atm: ATM = new BankATM();
atm.withdraw(100); // Simple interface, complex logic hidden
```

### 2. **Flexibility**
```typescript
// Switch implementations without changing client code
abstract class Shape {
  abstract getArea(): number;
  abstract getPerimeter(): number;
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  
  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) { super(); }
  
  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

function calculateTotalArea(shapes: Shape[]): number {
  return shapes.reduce((total, shape) => total + shape.getArea(), 0);
}

const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6)
];

console.log(calculateTotalArea(shapes)); // Works regardless of shape type
```

### 3. **Maintenance**
```typescript
// Changes to internal implementation don't affect client code
class PasswordValidator {
  // Implementation can change without breaking client code
  isValid(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password);
  }
}

// Client code stays the same even if validation logic changes
const validator = new PasswordValidator();
if (validator.isValid("MyPassword123")) {
  console.log("Password is valid");
}
```

## Key Takeaways

- **Abstraction hides complexity** and provides a simple interface
- Use **abstract classes** for classes with common behavior
- Use **interfaces** for contracts/blueprints
- Allows **easy switching** between implementations
- Promotes **clean code** and **maintainability**

## Real-World Applications

- **APIs**: You don't know server implementation, just the endpoints
- **Libraries**: You use functions without knowing internal code
- **Drivers**: OS provides abstraction for hardware interaction
- **Frameworks**: React components hide DOM manipulation details
