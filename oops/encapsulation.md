# Encapsulation in OOP

## What is Encapsulation?

Encapsulation is the practice of **bundling data (attributes) and methods (behavior) together** within a class, and **controlling access** to them using access modifiers (private, protected, public). It's about keeping the internal state of an object safe and hidden.

## Real-World Analogy

Think of a **Bank Account**:
- Your balance is private (you can't directly change it)
- You can only deposit/withdraw through specific methods (public)
- The bank validates transactions internally
- You access your account through a secure interface

Similarly, objects should protect their internal data and provide controlled access through methods.

## Key Concept

**Encapsulation = Data Hiding + Controlled Access**

## Access Modifiers

### 1. **Public** - Accessible everywhere
```typescript
class Student {
  public name: string = "John"; // Anyone can access
}

const student = new Student();
console.log(student.name); //  Works
```

### 2. **Private** - Accessible only within the class
```typescript
class BankAccount {
  private balance: number = 0; // Only internal methods can access

  deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
    }
  }
}

const account = new BankAccount();
account.deposit(100); //  Works
// account.balance = -50; // Error - cannot access private
```

### 3. **Protected** - Accessible within the class and subclasses
```typescript
class Animal {
  protected name: string; // Accessible in subclasses

  constructor(name: string) {
    this.name = name;
  }
}

class Dog extends Animal {
  bark(): void {
    console.log(`${this.name} is barking`); //  Can access protected
  }
}

const dog = new Dog("Buddy");
dog.bark(); // Buddy is barking
```

## Practical Example: Bank Account

```typescript
class BankAccount {
  private accountNumber: string;
  private balance: number;
  private pin: string;
  private transactionHistory: string[] = [];

  constructor(accountNumber: string, pin: string, initialBalance: number = 0) {
    this.accountNumber = accountNumber;
    this.pin = pin;
    this.balance = initialBalance;
  }

  // Public method - controlled access
  deposit(amount: number): boolean {
    if (amount <= 0) {
      console.log("Invalid amount");
      return false;
    }

    this.balance += amount;
    this.recordTransaction(`Deposited: $${amount}`);
    console.log(`Successfully deposited $${amount}. New balance: $${this.balance}`);
    return true;
  }

  // Public method - with validation
  withdraw(amount: number, pin: string): boolean {
    // Verify PIN first
    if (!this.verifyPin(pin)) {
      console.log("Incorrect PIN");
      return false;
    }

    if (amount <= 0 || amount > this.balance) {
      console.log("Invalid withdrawal amount");
      return false;
    }

    this.balance -= amount;
    this.recordTransaction(`Withdrew: $${amount}`);
    console.log(`Successfully withdrew $${amount}. New balance: $${this.balance}`);
    return true;
  }

  // Public method - read-only balance
  checkBalance(pin: string): number | null {
    if (!this.verifyPin(pin)) {
      console.log("Incorrect PIN");
      return null;
    }

    return this.balance;
  }

  // Private method - verification
  private verifyPin(pin: string): boolean {
    return this.pin === pin;
  }

  // Private method - record transactions
  private recordTransaction(transaction: string): void {
    const timestamp = new Date().toLocaleString();
    this.transactionHistory.push(`${timestamp}: ${transaction}`);
  }

  // Public method - view transaction history
  getTransactionHistory(pin: string): string[] | null {
    if (!this.verifyPin(pin)) {
      console.log("Incorrect PIN");
      return null;
    }

    return this.transactionHistory;
  }
}

// Usage
const account = new BankAccount("1234567890", "1234", 1000);

account.deposit(500);              // Successfully deposited $500
account.withdraw(200, "1234");     // Successfully withdrew $200
account.checkBalance("1234");      // 1300

account.balance = 5000;            // Error - cannot access private property
// account.pin = "5678";           // Error - cannot access private property
```

## Getters and Setters

Use getters and setters to provide controlled access to private properties:

```typescript
class Student {
  private _age: number;

  constructor(age: number) {
    this._age = age;
  }

  // Getter - read access with validation
  get age(): number {
    return this._age;
  }

  // Setter - write access with validation
  set age(value: number) {
    if (value > 0 && value < 120) {
      this._age = value;
    } else {
      console.log("Invalid age");
    }
  }
}

const student = new Student(20);
console.log(student.age);  // 20
student.age = 25;          //  Valid
student.age = -5;          // Invalid age (setter prevents this)
console.log(student.age);  // 25
```

## Example: Product in E-commerce

```typescript
class Product {
  private id: string;
  private name: string;
  private price: number;
  private quantity: number;
  private discount: number = 0;

  constructor(id: string, name: string, price: number, quantity: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  // Getter for readonly properties
  get productName(): string {
    return this.name;
  }

  get productPrice(): number {
    return this.price;
  }

  // Getter with calculation
  get finalPrice(): number {
    return this.price * (1 - this.discount / 100);
  }

  // Setter with validation
  set applyDiscount(discountPercent: number) {
    if (discountPercent >= 0 && discountPercent <= 100) {
      this.discount = discountPercent;
    } else {
      console.log("Discount must be between 0 and 100");
    }
  }

  // Public method - controlled stock update
  updateStock(newQuantity: number): boolean {
    if (newQuantity >= 0) {
      this.quantity = newQuantity;
      return true;
    }
    console.log("Stock cannot be negative");
    return false;
  }

  // Public method - purchase
  purchase(quantity: number): boolean {
    if (quantity > 0 && quantity <= this.quantity) {
      this.quantity -= quantity;
      console.log(`Purchased ${quantity} units. Total price: $${this.finalPrice * quantity}`);
      return true;
    }
    console.log("Invalid purchase quantity");
    return false;
  }

  // Public method - get product info
  getInfo(): string {
    return `${this.name} - Price: $${this.finalPrice} (Stock: ${this.quantity})`;
  }
}

// Usage
const laptop = new Product("P001", "Dell Laptop", 1000, 10);
console.log(laptop.getInfo());     // Dell Laptop - Price: $1000 (Stock: 10)

laptop.applyDiscount = 10;
console.log(laptop.getInfo());     // Dell Laptop - Price: $900 (Stock: 10)

laptop.purchase(2);                // Purchased 2 units. Total price: $1800
```

## Benefits of Encapsulation

### 1. **Data Protection**
```typescript
class Temperature {
  private kelvin: number;

  constructor(kelvin: number) {
    this.kelvin = Math.max(0, kelvin); // Prevent invalid temperatures
  }

  // No one can set invalid temperature directly
  set celsius(value: number) {
    this.kelvin = value + 273.15;
  }

  get celsius(): number {
    return this.kelvin - 273.15;
  }
}
```

### 2. **Validation**
```typescript
class Email {
  private email: string = "";

  set userEmail(value: string) {
    if (this.isValidEmail(value)) {
      this.email = value;
    } else {
      console.log("Invalid email format");
    }
  }

  get userEmail(): string {
    return this.email;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### 3. **Internal Changes Don't Break Code**
```typescript
// Old implementation
class Calculator {
  private result: number = 0;
  
  add(a: number, b: number): number {
    this.result = a + b;
    return this.result;
  }
}

// New implementation - client code doesn't change
class Calculator {
  private results: number[] = [];
  
  add(a: number, b: number): number {
    const result = a + b;
    this.results.push(result);
    return result;
  }
}
```

### 4. **Read-Only Properties**
```typescript
class ImmutableID {
  private readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  // id = "new-id"; // Error - cannot modify readonly
}
```

## Best Practices

 **Do:**
- Keep data private
- Provide public methods for access
- Validate data in setters
- Use readonly for constants
- Hide implementation details

**Don't:**
- Expose all properties as public
- Create setters without validation
- Allow direct modification of collection properties
- Break encapsulation to avoid effort

## Key Takeaways

- **Encapsulation protects data** from unauthorized access
- Use **access modifiers** (private, protected, public)
- Use **getters and setters** for controlled access
- Always **validate** before changing internal state
- Hide **internal complexity** from the outside world

## Real-World Applications

- **Password fields**: Can't read, only check
- **Database connections**: Private pooling, public queries
- **Configuration objects**: Read-only after initialization
- **API endpoints**: Hidden authentication, public resources
