# Inheritance in OOP

## What is Inheritance?

Inheritance is a mechanism that allows a **new class to inherit properties and methods** from an existing class. The existing class is called the **parent (base/super)** class, and the new class is called the **child (derived/sub)** class.

## Real-World Analogy

Think of **Animal Classification**:
- All animals have common characteristics (name, age, eat, sleep)
- Dogs, cats, birds are specific types of animals
- Dogs inherit common traits but also have specific behaviors (bark)
- Rather than defining all animals separately, we define common traits once

Similarly in code, we avoid code duplication by sharing common functionality.

## Key Concept

**Inheritance = Code Reuse + Hierarchy**

## Basic Example

```typescript
// Parent class - defines common functionality
class Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  eat(): void {
    console.log(`${this.name} is eating`);
  }

  sleep(): void {
    console.log(`${this.name} is sleeping`);
  }
}

// Child class - inherits from Animal and adds specific behavior
class Dog extends Animal {
  breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age); // Call parent constructor
    this.breed = breed;
  }

  bark(): void {
    console.log(`${this.name} is barking: Woof Woof!`);
  }
}

// Usage
const dog = new Dog("Buddy", 5, "Golden Retriever");
dog.eat();   // Buddy is eating (inherited)
dog.sleep(); // Buddy is sleeping (inherited)
dog.bark();  // Buddy is barking: Woof Woof! (own method)
```

## Types of Inheritance

### 1. **Single Inheritance**
```typescript
// One child inherits from one parent
class Vehicle {
  speed: number = 0;
  
  accelerate(): void {
    this.speed += 10;
  }
}

class Car extends Vehicle {
  doors: number = 4;
  
  openTrunk(): void {
    console.log("Trunk opened");
  }
}
```

### 2. **Multi-level Inheritance**
```typescript
// Chain of inheritance - grandparent  parent  child
class Animal {
  move(): void {
    console.log("Moving");
  }
}

class Mammal extends Animal {
  warm_blooded: boolean = true;
  
  breathe(): void {
    console.log("Breathing through lungs");
  }
}

class Dog extends Mammal {
  bark(): void {
    console.log("Woof!");
  }
}

const dog = new Dog();
dog.move();    // Moving (from Animal)
dog.breathe(); // Breathing through lungs (from Mammal)
dog.bark();    // Woof! (from Dog)
```

### 3. **Hierarchical Inheritance**
```typescript
// Multiple children inherit from one parent
class Shape {
  color: string = "red";
  
  getColor(): string {
    return this.color;
  }
}

class Circle extends Shape {
  radius: number = 5;
  
  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle extends Shape {
  width: number = 10;
  height: number = 5;
  
  getArea(): number {
    return this.width * this.height;
  }
}
```

## Method Overriding

Child class can override parent class methods to provide specific behavior:

```typescript
class Animal {
  makeSound(): void {
    console.log("Some generic sound");
  }
}

class Dog extends Animal {
  // Override parent method
  makeSound(): void {
    console.log("Woof! Woof!");
  }
}

class Cat extends Animal {
  // Override parent method
  makeSound(): void {
    console.log("Meow!");
  }
}

const dog = new Dog();
const cat = new Cat();

dog.makeSound(); // Woof! Woof!
cat.makeSound(); // Meow!
```

## Using super keyword

The `super` keyword calls parent class methods:

```typescript
class Employee {
  name: string;
  salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }

  getInfo(): string {
    return `Name: ${this.name}, Salary: $${this.salary}`;
  }
}

class Manager extends Employee {
  department: string;

  constructor(name: string, salary: number, department: string) {
    super(name, salary); // Call parent constructor
    this.department = department;
  }

  // Override and extend parent method
  getInfo(): string {
    return super.getInfo() + `, Department: ${this.department}`;
  }

  assignTask(task: string): void {
    console.log(`${this.name} assigned task: ${task}`);
  }
}

const manager = new Manager("John", 80000, "Engineering");
console.log(manager.getInfo());
// Name: John, Salary: $80000, Department: Engineering
```

## Practical Example: E-commerce System

```typescript
// Base class - common to all users
class User {
  protected id: string;
  protected name: string;
  protected email: string;
  protected registrationDate: Date;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.registrationDate = new Date();
  }

  getProfile(): string {
    return `${this.name} (${this.email})`;
  }

  updateEmail(newEmail: string): void {
    this.email = newEmail;
    console.log(`Email updated to ${newEmail}`);
  }
}

// Customer inherits from User
class Customer extends User {
  private cart: any[] = [];
  private orderHistory: any[] = [];

  addToCart(item: any): void {
    this.cart.push(item);
    console.log(`${item.name} added to cart`);
  }

  checkout(): void {
    console.log(`Processing order for ${this.name}`);
    this.orderHistory.push({
      items: this.cart,
      date: new Date()
    });
    this.cart = [];
  }

  getOrderHistory(): number {
    return this.orderHistory.length;
  }
}

// Admin inherits from User
class Admin extends User {
  private permissions: string[] = [];
  private managedUsers: User[] = [];

  grantPermission(permission: string): void {
    this.permissions.push(permission);
    console.log(`Permission granted: ${permission}`);
  }

  removeUser(userId: string): void {
    console.log(`${this.name} removed user ${userId}`);
  }

  getReport(): string {
    return `Admin Report: ${this.managedUsers.length} users managed`;
  }
}

// Usage
const customer = new Customer("C001", "Alice", "alice@email.com");
customer.addToCart({ name: "Laptop", price: 1000 });
customer.checkout();
console.log(customer.getOrderHistory()); // 1

const admin = new Admin("A001", "Bob", "bob@email.com");
admin.grantPermission("delete_user");
console.log(admin.getReport()); // Admin Report: 0 users managed
```

## Protected Access in Inheritance

```typescript
class Parent {
  public publicVar: string = "public";
  protected protectedVar: string = "protected";
  private privateVar: string = "private";

  protectedMethod(): void {
    console.log("Protected method");
  }

  private privateMethod(): void {
    console.log("Private method");
  }
}

class Child extends Parent {
  showVars(): void {
    console.log(this.publicVar);      //  Can access public
    console.log(this.protectedVar);   //  Can access protected
    // console.log(this.privateVar);  //  Cannot access private
    
    this.protectedMethod();           //  Can call protected
    // this.privateMethod();          //  Cannot call private
  }
}

const child = new Child();
child.publicVar = "modified";         //  Can modify public
// child.protectedVar = "modified";   //  Cannot modify protected (outside class)
```

## Abstract Classes for Inheritance

```typescript
// Abstract class - cannot be instantiated, forces subclasses to implement methods
abstract class PaymentMethod {
  abstract processPayment(amount: number): boolean;
  abstract getTransactionId(): string;

  // Concrete method - shared by all payment methods
  logTransaction(amount: number): void {
    console.log(`Transaction of $${amount} logged`);
  }
}

class CreditCard extends PaymentMethod {
  private cardNumber: string;

  constructor(cardNumber: string) {
    super();
    this.cardNumber = cardNumber;
  }

  processPayment(amount: number): boolean {
    console.log(`Processing $${amount} via Credit Card`);
    this.logTransaction(amount);
    return true;
  }

  getTransactionId(): string {
    return `CC-${Math.random()}`;
  }
}

class UPI extends PaymentMethod {
  private upiId: string;

  constructor(upiId: string) {
    super();
    this.upiId = upiId;
  }

  processPayment(amount: number): boolean {
    console.log(`Processing $${amount} via UPI`);
    this.logTransaction(amount);
    return true;
  }

  getTransactionId(): string {
    return `UPI-${Math.random()}`;
  }
}

// Usage
const creditCard = new CreditCard("1234-5678");
creditCard.processPayment(100);

const upi = new UPI("user@upi");
upi.processPayment(50);
```

## Benefits of Inheritance

### 1. **Code Reusability**
```typescript
// Common code is written once in parent
class BaseRepository {
  protected data: any[] = [];

  findById(id: string): any {
    return this.data.find(item => item.id === id);
  }

  getAll(): any[] {
    return this.data;
  }
}

// Child classes reuse these methods
class UserRepository extends BaseRepository {
  saveUser(user: any): void {
    this.data.push(user);
  }
}

class ProductRepository extends BaseRepository {
  saveProduct(product: any): void {
    this.data.push(product);
  }
}
```

### 2. **Logical Hierarchy**
```typescript
// Clear parent-child relationship
class Vehicle {
  // Common properties and methods
}

class Car extends Vehicle {
  // Car-specific properties
}

class Motorcycle extends Vehicle {
  // Motorcycle-specific properties
}

class Truck extends Vehicle {
  // Truck-specific properties
}
```

### 3. **Easy Maintenance**
```typescript
// Update once, affects all children
class Animal {
  move(): void {
    console.log("Animal is moving");
  }
}

// When you update move() in Animal, all child classes benefit
class Dog extends Animal {}
class Cat extends Animal {}
class Bird extends Animal {}
```

## Avoid: Diamond Problem

TypeScript prevents multiple inheritance (which causes the Diamond Problem):

```typescript
//  Not allowed in TypeScript
// class Child extends Parent1, Parent2 {}

//  Use interfaces instead
interface Walker {
  walk(): void;
}

interface Swimmer {
  swim(): void;
}

class Person implements Walker, Swimmer {
  walk(): void {
    console.log("Walking");
  }

  swim(): void {
    console.log("Swimming");
  }
}
```

## Best Practices

 **Do:**
- Use inheritance for "is-a" relationships
- Create meaningful class hierarchies
- Use abstract classes for common behavior
- Use `super` to call parent methods
- Keep inheritance depth reasonable (2-3 levels)

 **Don't:**
- Use inheritance just to reuse code (use composition instead)
- Create deep inheritance chains
- Override methods without good reason
- Use inheritance for "has-a" relationships

## Key Takeaways

- **Inheritance allows code reuse** through parent-child relationships
- **Override methods** to provide specific behavior
- **Use super keyword** to call parent methods
- **Abstract classes** enforce implementation in child classes
- **Protected access** allows sharing between parent and child
- **Inheritance is for "is-a" relationships**, not "has-a"

## Real-World Applications

- **UI Frameworks**: Button, TextBox inherit from Control
- **Database ORM**: Model class inherited by User, Product, Order
- **Game Development**: Sprite  Player, Enemy, NPC
- **Exception Handling**: Exception  RuntimeException, IOException
