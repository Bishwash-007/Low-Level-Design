# Object-Oriented Programming (OOP)

## What is OOP?

Object-Oriented Programming (OOP) is a programming paradigm that organizes code around **objects** and **classes** rather than functions and logic. It's a way of structuring code that makes it more modular, reusable, and easier to maintain.

## Why OOP?

- **Modularity**: Break complex problems into smaller, manageable objects
- **Reusability**: Write code once, use it many times
- **Maintainability**: Easier to update and debug code
- **Scalability**: Better suited for large projects
- **Real-world mapping**: Objects mirror real-world entities

## Core Concepts of OOP

OOP is built on four fundamental pillars:

1. **Abstraction** - Hiding complexity and showing only essential features
2. **Encapsulation** - Bundling data and methods together, controlling access
3. **Inheritance** - Creating new classes from existing ones
4. **Polymorphism** - Using objects in different ways

## Basic Example

```typescript
// Without OOP - Function-based approach (not ideal)
function createCar(brand: string, model: string, year: number) {
  return { brand, model, year };
}

const carData = createCar("Tesla", "Model 3", 2024);

// With OOP - Class-based approach (better)
class Car {
  brand: string;
  model: string;
  year: number;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getInfo(): string {
    return `${this.year} ${this.brand} ${this.model}`;
  }
}

const myCar = new Car("Tesla", "Model 3", 2024);
console.log(myCar.getInfo()); // Output: 2024 Tesla Model 3
```

## Class and Object

**Class**: A blueprint or template for creating objects
```typescript
class Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}
```

**Object**: An instance of a class
```typescript
const dog = new Animal("Buddy", 5);
const cat = new Animal("Whiskers", 3);

dog.speak(); // Output: Buddy makes a sound
cat.speak(); // Output: Whiskers makes a sound
```

## Benefits of OOP

### 1. Code Organization
```typescript
class BankAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    this.balance += amount;
  }

  withdraw(amount: number): boolean {
    if (amount <= this.balance) {
      this.balance -= amount;
      return true;
    }
    return false;
  }

  getBalance(): number {
    return this.balance;
  }
}
```

### 2. Code Reusability
```typescript
class Shape {
  color: string;

  constructor(color: string) {
    this.color = color;
  }

  describe(): string {
    return `A ${this.color} shape`;
  }
}

class Circle extends Shape {
  radius: number;

  constructor(color: string, radius: number) {
    super(color);
    this.radius = radius;
  }
}

const circle = new Circle("blue", 5);
console.log(circle.describe()); // A blue shape
```

### 3. Easy to Maintain and Extend
```typescript
class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

// Easy to extend with new functionality
class AdminUser extends User {
  permissions: string[] = [];

  grantPermission(permission: string): void {
    this.permissions.push(permission);
  }
}
```

## When to Use OOP

 Use OOP when:
- Building large, complex applications
- You need code reusability
- Multiple developers are working on the project
- The project requirements are likely to evolve

 Avoid OOP for:
- Simple scripts or small utilities
- Quick prototypes
- When functional programming is more appropriate

## Conclusion

OOP is a powerful paradigm that helps developers write organized, maintainable, and scalable code. The four pillars - Abstraction, Encapsulation, Inheritance, and Polymorphism - work together to create flexible and robust software systems.
