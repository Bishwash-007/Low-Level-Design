# SOLID Principles Guide

## S - Single Responsibility Principle (SRP)

**Definition:** A class should have only one reason to change, meaning it should have only one job or responsibility.

**Problem (Violation):**
```typescript
// Violates SRP - Multiple responsibilities
class User {
  private id: string;
  private email: string;
  private password: string;

  // Responsibility 1: User data management
  save(): void {
    console.log('Saving user to database');
  }

  // Responsibility 2: Email sending
  sendWelcomeEmail(): void {
    console.log('Sending welcome email');
  }

  // Responsibility 3: Password hashing
  hashPassword(): string {
    console.log('Hashing password');
    return 'hashed_password';
  }

  // Responsibility 4: Authentication
  authenticate(password: string): boolean {
    console.log('Authenticating user');
    return password === this.password;
  }
}
```

**Solution (Following SRP):**
```typescript
// Follows SRP - Each class has single responsibility

class User {
  constructor(
    private id: string,
    private email: string,
    private password: string
  ) {}

  getId(): string { return this.id; }
  getEmail(): string { return this.email; }
  getPassword(): string { return this.password; }
}

class UserRepository {
  save(user: User): void {
    console.log('Saving user to database');
  }

  findById(id: string): User | null {
    console.log('Finding user by id');
    return null;
  }
}

class EmailService {
  sendWelcomeEmail(email: string): void {
    console.log(`Sending welcome email to ${email}`);
  }
}

class PasswordService {
  hashPassword(password: string): string {
    console.log('Hashing password');
    return 'hashed_password';
  }

  authenticate(plainPassword: string, hashedPassword: string): boolean {
    console.log('Authenticating user');
    return true;
  }
}

// Usage
const user = new User('1', 'john@example.com', 'password123');
const repository = new UserRepository();
const emailService = new EmailService();
const passwordService = new PasswordService();

repository.save(user);
emailService.sendWelcomeEmail(user.getEmail());
const hashedPassword = passwordService.hashPassword(user.getPassword());
```

**Benefits:**
- Easier to understand and maintain
- Easier to test (can mock individual concerns)
- Changes in one responsibility don't affect others
- Better code reuse

**When to Apply:**
- Class has multiple reasons to change
- Class is difficult to name (can't describe in one sentence)
- Large classes with many methods

---

## O - Open/Closed Principle (OCP)

**Definition:** Software entities should be open for extension but closed for modification. Add new features without changing existing code.

**Problem (Violation):**
```typescript
// Violates OCP - Need to modify existing code to add new payment methods
class PaymentProcessor {
  process(type: string, amount: number): boolean {
    if (type === 'credit-card') {
      console.log(`Processing ${amount} via Credit Card`);
      return true;
    } else if (type === 'paypal') {
      console.log(`Processing ${amount} via PayPal`);
      return true;
    } else if (type === 'stripe') {
      console.log(`Processing ${amount} via Stripe`);
      return true;
    }
    return false;
  }
}

// Adding new payment method requires modifying the class
```

**Solution (Following OCP):**
```typescript
//  Follows OCP - Can add new payment methods without modifying existing code

interface PaymentMethod {
  process(amount: number): boolean;
}

class CreditCardPayment implements PaymentMethod {
  process(amount: number): boolean {
    console.log(`Processing ${amount} via Credit Card`);
    return true;
  }
}

class PayPalPayment implements PaymentMethod {
  process(amount: number): boolean {
    console.log(`Processing ${amount} via PayPal`);
    return true;
  }
}

class StripePayment implements PaymentMethod {
  process(amount: number): boolean {
    console.log(`Processing ${amount} via Stripe`);
    return true;
  }
}

// Adding new payment method - NO modification to existing code
class CryptoPayment implements PaymentMethod {
  process(amount: number): boolean {
    console.log(`Processing ${amount} via Crypto`);
    return true;
  }
}

class PaymentProcessor {
  constructor(private paymentMethod: PaymentMethod) {}

  process(amount: number): boolean {
    return this.paymentMethod.process(amount);
  }
}

// Usage
const creditCardProcessor = new PaymentProcessor(new CreditCardPayment());
creditCardProcessor.process(100);

const cryptoProcessor = new PaymentProcessor(new CryptoPayment());
cryptoProcessor.process(50);
```

**Benefits:**
- New features can be added without breaking existing code
- Reduces risk of regression bugs
- Promotes extensibility through inheritance and polymorphism

**How to Achieve:**
- Use abstraction (interfaces, abstract classes)
- Use inheritance and polymorphism
- Use composition and dependency injection
- Keep classes focused (SRP helps!)

---

## L - Liskov Substitution Principle (LSP)

**Definition:** Derived classes must be substitutable for their base classes. A subclass should not violate the contracts of its parent class.

**Problem (Violation):**
```typescript
//  Violates LSP - Square breaks Rectangle contract
class Rectangle {
  protected width: number = 0;
  protected height: number = 0;

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Force equal sides
  }

  setHeight(height: number): void {
    this.width = height;
    this.height = height; // Force equal sides
  }
}

// This breaks LSP - Square doesn't behave like Rectangle
function testArea(rect: Rectangle): void {
  rect.setWidth(5);
  rect.setHeight(10);
  console.log(rect.getArea()); // Expect 50

  if (rect instanceof Square) {
    console.log('This would fail: area is 100, not 50');
  }
}

testArea(new Square()); // Breaks the contract!
```

**Solution (Following LSP):**
```typescript
//  Follows LSP - Common base with appropriate subtypes

interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  setWidth(width: number): Rectangle {
    return new Rectangle(width, this.height);
  }

  setHeight(height: number): Rectangle {
    return new Rectangle(this.width, height);
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private side: number) {}

  setSide(side: number): Square {
    return new Square(side);
  }

  getArea(): number {
    return this.side * this.side;
  }
}

function testArea(shape: Shape): void {
  console.log(`Area: ${shape.getArea()}`);
}

testArea(new Rectangle(5, 10)); // 50
testArea(new Square(5)); // 25
```

**Key Points:**
- Preconditions cannot be strengthened in subtypes
- Postconditions cannot be weakened in subtypes
- Invariants must be preserved
- History rule: subtypes must not introduce new side effects

**Benefits:**
- Inheritance hierarchies are reliable
- Code using base class works correctly with any subclass
- Prevents surprising behavior

---

## I - Interface Segregation Principle (ISP)

**Definition:** Clients should not be forced to depend on interfaces they don't use. Many specific interfaces are better than one general-purpose interface.

**Problem (Violation):**
```typescript
//  Violates ISP - Fat interface forces unnecessary implementation
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  manage(): void;
}

class HumanWorker implements Worker {
  work(): void { console.log('Working'); }
  eat(): void { console.log('Eating'); }
  sleep(): void { console.log('Sleeping'); }
  manage(): void { /* Not applicable to regular worker */ }
}

class RobotWorker implements Worker {
  work(): void { console.log('Working'); }
  eat(): void { /* Not applicable */ }
  sleep(): void { /* Not applicable */ }
  manage(): void { console.log('Managing'); }
}
```

**Solution (Following ISP):**
```typescript
//  Follows ISP - Segregated, focused interfaces

interface Worker {
  work(): void;
}

interface Eater {
  eat(): void;
}

interface Sleeper {
  sleep(): void;
}

interface Manager {
  manage(): void;
}

class HumanWorker implements Worker, Eater, Sleeper {
  work(): void { console.log('Working'); }
  eat(): void { console.log('Eating'); }
  sleep(): void { console.log('Sleeping'); }
}

class RobotWorker implements Worker, Manager {
  work(): void { console.log('Working'); }
  manage(): void { console.log('Managing'); }
}

class Manager implements Worker, Manager, Eater, Sleeper {
  work(): void { console.log('Working'); }
  manage(): void { console.log('Managing'); }
  eat(): void { console.log('Eating'); }
  sleep(): void { console.log('Sleeping'); }
}
```

**Benefits:**
- Classes implement only needed behavior
- Easier to maintain and modify
- Reduces coupling
- Better testability

**When to Apply:**
- Interface has methods not all implementations need
- Implementations leave methods empty
- Clients depend on methods they don't use

---

## D - Dependency Inversion Principle (DIP)

**Definition:** High-level modules should not depend on low-level modules. Both should depend on abstractions. Depend on interfaces, not concrete implementations.

**Problem (Violation):**
```typescript
//  Violates DIP - Direct dependency on concrete classes
class MySQLDatabase {
  query(sql: string): any[] {
    console.log('Querying MySQL');
    return [];
  }
}

class UserService {
  private db = new MySQLDatabase(); // Direct dependency on concrete class

  getUser(id: string): any {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Changing database requires modifying UserService
```

**Solution (Following DIP):**
```typescript
//  Follows DIP - Depend on abstraction (interface)

interface Database {
  query(sql: string): any[];
}

class MySQLDatabase implements Database {
  query(sql: string): any[] {
    console.log('Querying MySQL');
    return [];
  }
}

class PostgresDatabase implements Database {
  query(sql: string): any[] {
    console.log('Querying Postgres');
    return [];
  }
}

class UserService {
  constructor(private db: Database) {} // Dependency injection

  getUser(id: string): any {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Usage - Easy to swap implementations
const mysqlDb = new MySQLDatabase();
const userService1 = new UserService(mysqlDb);

const postgresDb = new PostgresDatabase();
const userService2 = new UserService(postgresDb);
```

**Implementation Techniques:**
1. **Constructor Injection:**
```typescript
class UserService {
  constructor(private db: Database) {}
}
```

2. **Property Injection:**
```typescript
class UserService {
  private db: Database;
  
  setDatabase(db: Database): void {
    this.db = db;
  }
}
```

3. **Method Injection:**
```typescript
class UserService {
  getUser(id: string, db: Database): any {
    return db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}
```

**Benefits:**
- Easy to test (can inject mock dependencies)
- Easy to swap implementations
- Loose coupling
- Flexible architecture

---

## Applying SOLID Together

When all SOLID principles are applied together, they create a foundation for:
- **Maintainable Code**: Each class has one clear responsibility
- **Extensible Architecture**: New features don't break existing code
- **Testable Code**: Dependencies are injected and mockable
- **Flexible Systems**: Easy to swap implementations
- **Reliable Hierarchies**: Inheritance works predictably

**Example: Full SOLID Application**

```typescript
// D - Depend on abstractions
interface UserRepository {
  save(user: User): void;
  findById(id: string): User | null;
}

// S - Single responsibility
class MySQLUserRepository implements UserRepository {
  save(user: User): void {
    console.log('Saving to MySQL');
  }

  findById(id: string): User | null {
    return null;
  }
}

// S - Single responsibility
class EmailService {
  sendWelcomeEmail(email: string): void {
    console.log(`Sending email to ${email}`);
  }
}

// O - Open for extension, closed for modification
interface UserValidator {
  validate(user: User): boolean;
}

class EmailValidator implements UserValidator {
  validate(user: User): boolean {
    return user.email.includes('@');
  }
}

// D - Inject dependencies
class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private validator: UserValidator
  ) {}

  registerUser(user: User): void {
    if (!this.validator.validate(user)) {
      throw new Error('Invalid user');
    }

    this.userRepository.save(user);
    this.emailService.sendWelcomeEmail(user.email);
  }
}

// I - Segregated interfaces
interface User {
  id: string;
  email: string;
}

// L - Substitutable implementations
class User implements User {
  constructor(public id: string, public email: string) {}
}
```

**Key Takeaway:** SOLID principles work together to create code that is easy to understand, maintain, test, and extend.
