# Object-Oriented Programming Concepts

## Core OOP Concepts

### Abstraction

**Definition:** Hiding complex implementation details and showing only the essential features of an object.

**Purpose:** Reduce complexity by hiding unnecessary details and providing a clean interface.

**Example:**
```typescript
// Abstract class defines interface without implementation details
abstract class PaymentProcessor {
  abstract process(amount: number): boolean;

  logTransaction(amount: number): void {
    console.log(`Transaction of ${amount} recorded at ${new Date()}`);
  }
}

class StripeProcessor extends PaymentProcessor {
  process(amount: number): boolean {
    console.log(`Processing ${amount} via Stripe API`);
    this.logTransaction(amount);
    return true;
  }
}

// Usage - User doesn't need to know HOW Stripe works
const processor = new StripeProcessor();
processor.process(100); // Simple interface, complex implementation hidden
```

**Real-World Analogy:** Using a car's steering wheel (abstraction) without needing to understand the mechanical details inside.

**When to Use:**
- Complex systems that need simplified interfaces
- When implementation details may change
- When you want to expose only relevant features

---

### Encapsulation

**Definition:** Bundling data and methods together and hiding internal details using access modifiers.

**Purpose:** Protect data integrity, control access, allow internal changes without affecting external code.

**Example:**
```typescript
//  Good encapsulation
class BankAccount {
  private balance: number = 0; // Private - can't be accessed directly
  private transactionHistory: Transaction[] = [];

  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    this.balance += amount;
    this.recordTransaction('deposit', amount);
  }

  public withdraw(amount: number): void {
    if (amount > this.balance) {
      throw new Error('Insufficient funds');
    }
    this.balance -= amount;
    this.recordTransaction('withdrawal', amount);
  }

  public getBalance(): number {
    return this.balance;
  }

  private recordTransaction(type: string, amount: number): void {
    this.transactionHistory.push({
      type,
      amount,
      timestamp: new Date()
    });
  }
}

// Usage - Can't violate invariants
const account = new BankAccount();
account.deposit(100);
account.withdraw(50);
console.log(account.getBalance()); // 50

//  Can't do this - balance is private
// account.balance = -1000; // Compile error!
```

**Benefits:**
- **Data Integrity:** Can't set invalid states
- **Flexibility:** Can change implementation without breaking client code
- **Maintainability:** Clear public interface

**Access Modifiers in TypeScript:**
- `public`: Accessible from anywhere (default)
- `private`: Accessible only within the class
- `protected`: Accessible within the class and its subclasses
- `readonly`: Can't be changed after initialization

---

### Inheritance

**Definition:** Creating new classes based on existing classes, inheriting their properties and methods.

**Purpose:** Code reuse, establish relationships, create class hierarchies.

**Example:**
```typescript
// Parent class
class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): void {
    console.log(`${this.name} makes a sound`);
  }

  sleep(): void {
    console.log(`${this.name} is sleeping`);
  }
}

// Child class inherits from Animal
class Dog extends Animal {
  // Overrides parent method
  speak(): void {
    console.log(`${this.name} barks: Woof!`);
  }

  // New method specific to Dog
  fetch(): void {
    console.log(`${this.name} fetches the ball`);
  }
}

class Cat extends Animal {
  speak(): void {
    console.log(`${this.name} meows: Meow!`);
  }

  scratch(): void {
    console.log(`${this.name} scratches the furniture`);
  }
}

// Usage
const dog = new Dog('Buddy');
dog.speak(); // Buddy barks: Woof!
dog.sleep(); // Buddy is sleeping
dog.fetch(); // Buddy fetches the ball

const cat = new Cat('Whiskers');
cat.speak(); // Whiskers meows: Meow!
cat.sleep(); // Whiskers is sleeping
```

**Type of Inheritance:**
- **Single Inheritance:** Child inherits from one parent
- **Multi-level Inheritance:** Parent -> Child -> Grandchild
- **Hierarchical Inheritance:** Multiple children from one parent

**When to Use:**
- Creating "is-a" relationships
- Sharing common functionality across related classes
- Creating taxonomies or class hierarchies

**Important:** Prefer composition over inheritance when possible for better flexibility.

---

### Polymorphism

**Definition:** Objects of different types can be used through the same interface, responding appropriately based on their type.

**Purpose:** Write generic code that works with different types, enable flexible designs.

**Types of Polymorphism:**

#### 1. Compile-time Polymorphism (Method Overloading)
```typescript
class Calculator {
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number | string, b: number | string): number | string {
    if (typeof a === 'number' && typeof b === 'number') {
      return a + b;
    }
    return `${a}${b}`;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
console.log(calc.add('Hello', 'World')); // HelloWorld
```

#### 2. Runtime Polymorphism (Method Overriding)
```typescript
interface Shape {
  area(): number;
}

class Circle implements Shape {
  constructor(private radius: number) {}

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  area(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private side: number) {}

  area(): number {
    return this.side ** 2;
  }
}

// Polymorphic behavior - same function works with different types
function calculateTotalArea(shapes: Shape[]): number {
  return shapes.reduce((total, shape) => total + shape.area(), 0);
}

// Usage
const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Square(3)
];

console.log(calculateTotalArea(shapes)); // Calculates correctly for each shape type
```

**Benefits:**
- Write flexible code that works with multiple types
- Easy to extend with new types
- Reduces code duplication

---

## Advanced OOP Patterns

### Composition over Inheritance

**Principle:** Prefer using objects as members (composition) rather than extending classes (inheritance).

**Problem with Inheritance:**
```typescript
//  Rigid hierarchy
class Animal {
  eat(): void { console.log('Eating'); }
}

class Flyable extends Animal {
  fly(): void { console.log('Flying'); }
}

class Swimmable extends Animal {
  swim(): void { console.log('Swimming'); }
}

// What if we need an animal that flies AND swims?
// Multiple inheritance not allowed in TypeScript
```

**Solution with Composition:**
```typescript
//  Flexible composition
interface Behavior {
  perform(): void;
}

class Eating implements Behavior {
  perform(): void { console.log('Eating'); }
}

class Flying implements Behavior {
  perform(): void { console.log('Flying'); }
}

class Swimming implements Behavior {
  perform(): void { console.log('Swimming'); }
}

class Animal {
  private behaviors: Behavior[] = [];

  addBehavior(behavior: Behavior): void {
    this.behaviors.push(behavior);
  }

  act(): void {
    this.behaviors.forEach(b => b.perform());
  }
}

// Usage
const duck = new Animal();
duck.addBehavior(new Eating());
duck.addBehavior(new Flying());
duck.addBehavior(new Swimming());
duck.act(); // Performs all behaviors
```

**Benefits:**
- More flexible than inheritance
- Avoids rigid hierarchies
- Easier to test and maintain

---

### Association and Aggregation

**Association:** Objects are related but independent.
```typescript
class Teacher {
  constructor(private name: string) {}
}

class Student {
  constructor(private name: string, private teachers: Teacher[]) {}
}

// Teachers exist independently, students reference them
```

**Aggregation:** "Has-a" relationship where objects can exist independently.
```typescript
class Department {
  private employees: Employee[] = [];

  addEmployee(employee: Employee): void {
    this.employees.push(employee);
  }

  // Employees can exist independently of department
}
```

**Composition:** Stronger "has-a" relationship where child objects depend on parent.
```typescript
class House {
  private rooms: Room[];

  constructor() {
    this.rooms = [
      new Room('Living Room'),
      new Room('Bedroom'),
      new Room('Kitchen')
    ];
  }

  // Rooms are part of house, don't exist independently
}

class Room {
  constructor(private name: string) {}
}
```

---

## Design Best Practices

### Use Interfaces to Define Contracts
```typescript
interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

class MySQLUserRepository implements UserRepository {
  // Must implement all interface methods
}
```

### Favor Composition Over Inheritance
```typescript
//  Inheritance
class Employee extends Person { }

//  Composition
class Employee {
  private person: Person;
}
```

### Use Access Modifiers Appropriately
```typescript
class User {
  public id: string; // Needs to be accessible
  private password: string; // Must be hidden
  protected role: string; // Accessible to subclasses
}
```

### Keep Classes Focused (Single Responsibility)
```typescript
//  Too many responsibilities
class Order {
  calculateTotal() { }
  saveToDatabase() { }
  sendEmail() { }
}

//  Focused classes
class Order { calculateTotal() { } }
class OrderRepository { save() { } }
class OrderEmailService { send() { } }
```

### Use Immutability When Possible
```typescript
class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string
  ) {}

  // Can't modify properties
}
```

---

## Summary Table

| Concept | Purpose | When to Use |
|---------|---------|------------|
| **Abstraction** | Hide complexity | Complex subsystems |
| **Encapsulation** | Protect data | Controlling access, ensuring validity |
| **Inheritance** | Code reuse, relationships | "Is-a" relationships |
| **Polymorphism** | Flexible code | Working with multiple types |
| **Composition** | Flexibility | Alternative to inheritance |
| **Interfaces** | Define contracts | Establishing expected behaviors |
| **Access Modifiers** | Control visibility | Managing scope and access |

Mastering OOP concepts enables creating systems that are robust, maintainable, and scalable.
