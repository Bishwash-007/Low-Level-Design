# Design Patterns Comprehensive Guide

## Creational Patterns

### Singleton Pattern
Ensures a class has only one instance and provides a global point of access.

**Use Cases:**
- Database connections
- Logger instances
- Configuration managers
- Connection pools

**TypeScript Example:**
```typescript
export class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string): void {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
}

// Usage
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
console.log(logger1 === logger2); // true
```

**Benefits:** Single responsibility, memory efficient, thread-safe initialization
**Drawbacks:** Hard to test (static state), hidden dependencies, difficult to mock

---

### Factory Pattern
Creates objects without specifying exact classes, hiding the instantiation logic.

**Use Cases:**
- Creating different types of notification services (Email, SMS, Push)
- Database drivers for different databases
- Payment processor factories

**TypeScript Example:**
```typescript
interface Database {
  connect(): void;
  query(sql: string): any[];
}

class MySQLDatabase implements Database {
  connect(): void { console.log('Connecting to MySQL'); }
  query(sql: string): any[] { return []; }
}

class PostgresDatabase implements Database {
  connect(): void { console.log('Connecting to Postgres'); }
  query(sql: string): any[] { return []; }
}

class DatabaseFactory {
  static createDatabase(type: 'mysql' | 'postgres'): Database {
    switch (type) {
      case 'mysql':
        return new MySQLDatabase();
      case 'postgres':
        return new PostgresDatabase();
      default:
        throw new Error(`Unknown database type: ${type}`);
    }
  }
}

// Usage
const db = DatabaseFactory.createDatabase('postgres');
db.connect();
```

**Benefits:** Decouples object creation, centralizes creation logic, easy to add new types
**When to Use:** When object creation logic is complex or depends on runtime conditions

---

### Builder Pattern
Constructs complex objects step-by-step, separating construction from representation.

**Use Cases:**
- Creating objects with many optional parameters
- Building queries
- Constructing configuration objects
- Creating immutable objects

**TypeScript Example:**
```typescript
class UserBuilder {
  private user = {
    id: '',
    name: '',
    email: '',
    age: 0,
    isActive: true,
  };

  setId(id: string): UserBuilder {
    this.user.id = id;
    return this;
  }

  setName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  setEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  setAge(age: number): UserBuilder {
    this.user.age = age;
    return this;
  }

  setIsActive(isActive: boolean): UserBuilder {
    this.user.isActive = isActive;
    return this;
  }

  build() {
    return { ...this.user };
  }
}

// Usage
const user = new UserBuilder()
  .setId('1')
  .setName('John')
  .setEmail('john@example.com')
  .setAge(30)
  .build();
```

**Benefits:** Makes code readable, handles optional parameters elegantly, immutability
**When to Use:** Objects with many optional parameters or complex initialization logic

---

### Abstract Factory Pattern
Creates families of related objects without specifying concrete classes.

**Use Cases:**
- UI theme factories (light/dark themes with consistent components)
- Cloud provider factories (AWS, Azure, GCP)
- Document format factories (PDF, Word, Excel exporters)

**TypeScript Example:**
```typescript
interface Button { render(): void; }
interface Checkbox { render(): void; }

class WindowsButton implements Button {
  render(): void { console.log('Rendering Windows Button'); }
}

class MacButton implements Button {
  render(): void { console.log('Rendering Mac Button'); }
}

class WindowsCheckbox implements Checkbox {
  render(): void { console.log('Rendering Windows Checkbox'); }
}

class MacCheckbox implements Checkbox {
  render(): void { console.log('Rendering Mac Checkbox'); }
}

interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class WindowsFactory implements GUIFactory {
  createButton(): Button { return new WindowsButton(); }
  createCheckbox(): Checkbox { return new WindowsCheckbox(); }
}

class MacFactory implements GUIFactory {
  createButton(): Button { return new MacButton(); }
  createCheckbox(): Checkbox { return new MacCheckbox(); }
}

// Usage
function createUI(factory: GUIFactory) {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  button.render();
  checkbox.render();
}

createUI(new WindowsFactory());
```

**Benefits:** Ensures families of products work together, easy to swap entire families
**When to Use:** Systems that must work with multiple families of products

---

### Prototype Pattern
Creates objects by cloning an existing prototype.

**Use Cases:**
- Complex object copying
- Avoiding expensive object creation
- Creating default configurations

**TypeScript Example:**
```typescript
interface Cloneable {
  clone(): Cloneable;
}

class User implements Cloneable {
  constructor(public id: string, public name: string, public email: string) {}

  clone(): User {
    return new User(this.id, this.name, this.email);
  }
}

// Usage
const user1 = new User('1', 'John', 'john@example.com');
const user2 = user1.clone();
user2.name = 'Jane';

console.log(user1.name); // John
console.log(user2.name); // Jane
```

**Benefits:** Faster object creation, avoids expensive initialization
**When to Use:** When object creation is expensive or complex

---

## Structural Patterns

### Adapter Pattern
Converts interface of one class to another, allowing incompatible interfaces to work together.

**Use Cases:**
- Integrating third-party libraries with different interfaces
- Legacy code integration
- Multiple database adapters

**TypeScript Example:**
```typescript
// Old interface
interface OldPaymentGateway {
  pay(amount: number): boolean;
}

// New interface
interface NewPaymentProcessor {
  processPayment(amount: number): Promise<boolean>;
}

class OldGateway implements OldPaymentGateway {
  pay(amount: number): boolean {
    console.log(`Processing ${amount} with old gateway`);
    return true;
  }
}

// Adapter
class PaymentAdapter implements NewPaymentProcessor {
  constructor(private oldGateway: OldPaymentGateway) {}

  async processPayment(amount: number): Promise<boolean> {
    return this.oldGateway.pay(amount);
  }
}

// Usage
const oldGateway = new OldGateway();
const adapter = new PaymentAdapter(oldGateway);
await adapter.processPayment(100);
```

**Benefits:** Makes incompatible interfaces compatible without changing them
**When to Use:** Integrating legacy code or third-party libraries with different APIs

---

### Decorator Pattern
Attaches additional responsibilities to objects dynamically, alternative to subclassing.

**Use Cases:**
- Express.js middleware
- Adding features without modifying original class (logging, caching, validation)
- UI component enhancements

**TypeScript Example:**
```typescript
interface Component {
  operation(): string;
}

class ConcreteComponent implements Component {
  operation(): string {
    return 'ConcreteComponent';
  }
}

abstract class Decorator implements Component {
  constructor(protected component: Component) {}
  operation(): string {
    return this.component.operation();
  }
}

class ConcreteDecoratorA extends Decorator {
  operation(): string {
    return `ConcreteDecoratorA(${super.operation()})`;
  }
}

class ConcreteDecoratorB extends Decorator {
  operation(): string {
    return `ConcreteDecoratorB(${super.operation()})`;
  }
}

// Usage
const component = new ConcreteComponent();
const decorated = new ConcreteDecoratorA(new ConcreteDecoratorB(component));
console.log(decorated.operation()); // ConcreteDecoratorA(ConcreteDecoratorB(ConcreteComponent))
```

**Benefits:** Adds functionality dynamically, avoids class explosion, more flexible than subclassing
**When to Use:** Need to add responsibilities to individual objects at runtime

---

### Proxy Pattern
Provides placeholder or surrogate for another object to control access.

**Use Cases:**
- Lazy loading resources
- Access control
- Logging/caching
- Remote object access

**TypeScript Example:**
```typescript
interface Subject {
  request(): void;
}

class RealSubject implements Subject {
  request(): void {
    console.log('RealSubject: Handling request.');
  }
}

class Proxy implements Subject {
  private realSubject: RealSubject | null = null;

  request(): void {
    if (this.realSubject === null) {
      console.log('Proxy: Lazy loading RealSubject...');
      this.realSubject = new RealSubject();
    }
    this.realSubject.request();
  }
}

// Usage
const proxy = new Proxy();
proxy.request(); // Lazy loads on first call
proxy.request(); // Reuses already loaded instance
```

**Benefits:** Controls access, enables lazy loading, adds cross-cutting concerns
**When to Use:** Need to control access or delay expensive operations

---

### Facade Pattern
Provides simplified interface to complex subsystem.

**Use Cases:**
- Simplifying complex library interfaces
- Grouping related operations
- Abstracting third-party service complexity

**TypeScript Example:**
```typescript
class SubsystemA {
  operationA(): string {
    return 'Subsystem A';
  }
}

class SubsystemB {
  operationB(): string {
    return 'Subsystem B';
  }
}

class Facade {
  private subsystemA = new SubsystemA();
  private subsystemB = new SubsystemB();

  operation(): string {
    return `Facade: ${this.subsystemA.operationA()}, ${this.subsystemB.operationB()}`;
  }
}

// Usage
const facade = new Facade();
console.log(facade.operation());
```

**Benefits:** Simplifies client code, hides complexity, decouples clients from subsystems
**When to Use:** Wrapping complex subsystems or libraries

---

## Behavioral Patterns

### Observer Pattern
Defines one-to-many relationship where objects are notified of state changes.

**Use Cases:**
- Event systems
- Real-time notifications
- MVC pattern (model change notifications)
- Pub/Sub systems

**TypeScript Example:**
```typescript
interface Observer {
  update(subject: Subject): void;
}

class Subject {
  private observers: Observer[] = [];
  private state: number = 0;

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  notify(): void {
    this.observers.forEach(observer => observer.update(this));
  }

  setState(state: number): void {
    this.state = state;
    this.notify();
  }

  getState(): number {
    return this.state;
  }
}

class ConcreteObserver implements Observer {
  constructor(private name: string) {}

  update(subject: Subject): void {
    console.log(`${this.name}: Subject state changed to ${subject.getState()}`);
  }
}

// Usage
const subject = new Subject();
subject.attach(new ConcreteObserver('Observer 1'));
subject.attach(new ConcreteObserver('Observer 2'));
subject.setState(10); // Notifies all observers
```

**Benefits:** Loose coupling, automatic notification, easy to add observers
**When to Use:** Objects need to react to state changes without tight coupling

---

### Strategy Pattern
Defines family of algorithms and makes them interchangeable at runtime.

**Use Cases:**
- Payment methods (credit card, PayPal, crypto)
- Sorting algorithms
- Validation strategies
- Pricing strategies

**TypeScript Example:**
```typescript
interface PaymentStrategy {
  pay(amount: number): boolean;
}

class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): boolean {
    console.log(`Paying ${amount} with Credit Card`);
    return true;
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number): boolean {
    console.log(`Paying ${amount} with PayPal`);
    return true;
  }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  process(amount: number): boolean {
    return this.strategy.pay(amount);
  }

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }
}

// Usage
const processor = new PaymentProcessor(new CreditCardPayment());
processor.process(100);

processor.setStrategy(new PayPalPayment());
processor.process(50);
```

**Benefits:** Easy to add new strategies, swappable at runtime, encapsulates algorithms
**When to Use:** Multiple ways to do something and need runtime selection

---

### State Pattern
Allows object to change behavior when internal state changes.

**Use Cases:**
- Order workflow states (pending, processing, shipped, delivered)
- Traffic light states
- User permission states
- Document states (draft, review, published)

**TypeScript Example:**
```typescript
interface State {
  handle(context: OrderContext): void;
}

class PendingState implements State {
  handle(context: OrderContext): void {
    console.log('Order is pending. Processing...');
    context.setState(new ProcessingState());
  }
}

class ProcessingState implements State {
  handle(context: OrderContext): void {
    console.log('Order is processing. Shipping...');
    context.setState(new ShippedState());
  }
}

class ShippedState implements State {
  handle(context: OrderContext): void {
    console.log('Order shipped. Complete!');
  }
}

class OrderContext {
  private state: State = new PendingState();

  setState(state: State): void {
    this.state = state;
  }

  process(): void {
    this.state.handle(this);
  }
}

// Usage
const order = new OrderContext();
order.process(); // Order is pending
order.process(); // Order is processing
order.process(); // Order shipped
```

**Benefits:** Encapsulates state-specific behavior, simplifies conditionals, easy to add states
**When to Use:** Objects have complex state-dependent behavior

---

### Command Pattern
Encapsulates request as object, enabling parameterization and queuing of requests.

**Use Cases:**
- Undo/Redo functionality
- Task queuing
- Request logging
- Macro recording

**TypeScript Example:**
```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  private isOn = false;

  turn_on(): void {
    this.isOn = true;
    console.log('Light is on');
  }

  turn_off(): void {
    this.isOn = false;
    console.log('Light is off');
  }
}

class TurnOnCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turn_on();
  }

  undo(): void {
    this.light.turn_off();
  }
}

class Invoker {
  private commands: Command[] = [];

  executeCommand(command: Command): void {
    command.execute();
    this.commands.push(command);
  }

  undo(): void {
    const command = this.commands.pop();
    if (command) {
      command.undo();
    }
  }
}

// Usage
const light = new Light();
const command = new TurnOnCommand(light);
const invoker = new Invoker();

invoker.executeCommand(command); // Light is on
invoker.undo(); // Light is off
```

**Benefits:** Decouples sender from receiver, enables queuing and logging, supports undo/redo
**When to Use:** Need to queue, log, or undo operations

---

## Summary Table

| Pattern | Problem | Solution |
|---------|---------|----------|
| **Factory** | Creating objects without specifying classes | Method hides instantiation logic |
| **Builder** | Complex object creation with many parameters | Step-by-step construction |
| **Singleton** | Need exactly one instance | Static instance holder |
| **Abstract Factory** | Create families of related objects | Factory for factories |
| **Adapter** | Incompatible interfaces | Wrapper that converts interface |
| **Decorator** | Add behavior dynamically | Wraps object with additional behavior |
| **Proxy** | Control access to object | Placeholder controls real object |
| **Facade** | Simplify complex subsystem | Single simplified interface |
| **Observer** | Objects react to state changes | Notifications to registered observers |
| **Strategy** | Choose algorithm at runtime | Interchangeable strategy objects |
| **State** | Behavior depends on state | State object determines behavior |
| **Command** | Encapsulate requests as objects | Command object executes request |
