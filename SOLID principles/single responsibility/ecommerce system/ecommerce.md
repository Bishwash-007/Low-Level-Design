# Single Responsibility Principle (SRP)

## Definition

The **Single Responsibility Principle** states that:

> **A class should have only one reason to change, meaning it should have only one responsibility.**

In other words, a class should do one thing and do it well. If a class has multiple responsibilities, it has multiple reasons to change, which makes the code harder to maintain, test, and extend.

## Why is SRP Important?

### 1. **Maintainability**
When each class has a single responsibility, it's easier to understand what the class does and maintain it. Changes related to that responsibility are localized to that class.

### 2. **Testability**
Classes with single responsibilities are easier to test in isolation. You can write focused unit tests for each class without having to mock multiple dependencies.

### 3. **Reusability**
Focused classes with single responsibilities are more reusable across different parts of your application. You can use them in different contexts without unnecessary dependencies.

### 4. **Flexibility**
When responsibilities are separated, you can change one aspect of the system without affecting others. This makes your code more flexible and extensible.

### 5. **Bug Prevention**
Changes to one responsibility are less likely to accidentally break functionality related to another responsibility.

## Example: E-Commerce Order Management System

Let's examine an e-commerce system that demonstrates the Single Responsibility Principle:

### Bad Design (Violating SRP)

```typescript
// This class violates SRP - it has too many responsibilities
class OrderProcessor {
  processOrder(products: Product[]) {
    // Responsibility 1: Calculating prices
    let total = 0;
    for (let product of products) {
      total += product.price;
    }

    // Responsibility 2: Generating invoices
    console.log('Invoice:');
    for (let product of products) {
      console.log(`${product.name}: $${product.price}`);
    }
    console.log(`Total: $${total}`);

    // Responsibility 3: Processing payments
    console.log(`Processing payment for: $${total}`);

    // Responsibility 4: Managing inventory
    for (let product of products) {
      product.inventory -= 1;
    }
  }
}
```

**Problems:**
- The class has 4 different reasons to change (pricing logic, invoice format, payment processing, inventory management)
- Hard to test individual features
- Changes in one area might break others
- Difficult to reuse components

### Good Design (Following SRP)

```typescript
// Product Class - Represents a product
export class Product {
  name: string;
  price: number;
  id: number;

  constructor(name: string, price: number, id: number) {
    this.name = name;
    this.price = price;
    this.id = id;
  }
}

// Order Class - Manages the collection of products
export class Order {
  products: Product[];

  constructor() {
    this.products = [];
  }

  addProduct(product: Product): void {
    this.products.push(product);
  }

  getProducts(): Product[] {
    return this.products;
  }

  removeProduct(productId: number): void {
    this.products = this.products.filter((p) => p.id !== productId);
  }
}

// PricingCalculator - Handles all pricing calculations
export class PricingCalculator {
  calculateTotal(products: Product[]): number {
    return products.reduce((total, product) => total + product.price, 0);
  }

  calculateTotalWithDiscount(products: Product[], discountPercent: number): number {
    const total = this.calculateTotal(products);
    return total * (1 - discountPercent / 100);
  }
}

// Invoice - Handles invoice generation
export class Invoice {
  generateInvoice(products: Product[], amount: number): void {
    console.log(
      '==\n' +
      '          INVOICE\n' +
      '==\n' +
      products.map((p) => `- ${p.name}: $${p.price.toFixed(2)}`).join('\n') +
      `\n--------------------------------\n` +
      `Total: $${amount.toFixed(2)}\n` +
      '==',
    );
  }
}

// PaymentProcessor - Handles payment transactions
export class PaymentProcessor {
  processPayment(amount: number): void {
    console.log(`Processing payment for total: $${amount.toFixed(2)}`);
    // Integration with payment gateway (Stripe, PayPal, etc.)
    console.log('Payment processed successfully!');
  }
}
```

## Responsibilities Breakdown

| Class | Single Responsibility | Reason to Change |
|-------|----------------------|------------------|
| `Product` | Represent a product with its properties | Product structure changes |
| `Order` | Manage collection of products in an order | Order management logic changes |
| `PricingCalculator` | Calculate total prices with discounts | Pricing logic or discount rules change |
| `Invoice` | Generate and format invoices | Invoice format or presentation changes |
| `PaymentProcessor` | Process payments | Payment gateway or transaction logic changes |

## Usage Example

```typescript
import { Invoice } from './Invoice';
import { Order, Product } from './Order';
import { PaymentProcessor } from './PaymentProcessor';
import { PricingCalculator } from './PricingCalculator';

// Create products
const product1 = new Product('Laptop', 1200, 1);
const product2 = new Product('Mouse', 25, 2);

// Create order and add products
const order = new Order();
order.addProduct(product1);
order.addProduct(product2);

// Calculate total price
const pricingCalculator = new PricingCalculator();
const total = pricingCalculator.calculateTotal(order.getProducts());

// Generate invoice
const invoice = new Invoice();
invoice.generateInvoice(order.getProducts(), total);

// Process payment
const paymentProcessor = new PaymentProcessor();
paymentProcessor.processPayment(total);
```

## Benefits in Action

### Easy to Test
```typescript
// Test only pricing logic without affecting other components
const calc = new PricingCalculator();
const total = calc.calculateTotal([product1, product2]);
assert(total === 1225);
```

### Easy to Extend
```typescript
// Add tax calculation without modifying other classes
class PricingCalculator {
  calculateTotalWithTax(products: Product[], taxPercent: number): number {
    const total = this.calculateTotal(products);
    return total * (1 + taxPercent / 100);
  }
}
```

### Easy to Maintain
```typescript
// Change payment gateway without affecting order management
class PaymentProcessor {
  processPaymentViaStripe(amount: number): void {
    // Stripe integration
  }

  processPaymentViaPayPal(amount: number): void {
    // PayPal integration
  }
}
```

## How to Identify SRP Violations

Look for these warning signs:

1. **Class has "and" in its name**: `OrderAndInvoiceProcessor` (should be separate classes)
2. **Hard to name the class**: If you struggle naming a class, it might have too many responsibilities
3. **High change frequency**: If a class changes often, it likely has too many responsibilities
4. **Multiple reasons to test**: If you need to test multiple aspects, it has multiple responsibilities
5. **Uses multiple frameworks/libraries**: A class using database, API, and UI libraries likely has too many responsibilities

## Best Practices

### Do's
- Assign one primary responsibility to each class
- Keep classes focused and cohesive
- Use clear, descriptive names that reflect responsibility
- Create helper classes to split complex logic
- Use dependency injection to connect related classes

### Don'ts
- Create "God classes" that do everything
- Mix business logic with presentation logic
- Combine multiple concerns in one class
- Create classes with vague or generic names
- Avoid refactoring when adding features

## Common Violations in Real Projects

### Violation 1: God Class
```typescript
// Violates SRP
class UserService {
  createUser() { }
  validateUser() { }
  sendEmail() { }
  logUserActivity() { }
  updateDatabase() { }
  generateReport() { }
}

// Follows SRP
class UserService { createUser() { } }
class UserValidator { validateUser() { } }
class EmailService { sendEmail() { } }
class Logger { logUserActivity() { } }
class UserRepository { updateDatabase() { } }
class ReportGenerator { generateReport() { } }
```

### Violation 2: Mixed Concerns
```typescript
// Violates SRP
class OrderService {
  calculatePrice() { }
  saveToDatabase() { }
  sendNotification() { }
  logMetrics() { }
}

// Follows SRP
class PricingService { calculatePrice() { }  }
class OrderRepository { saveToDatabase() { } }
class NotificationService { sendNotification() { } }
class MetricsLogger { logMetrics() { } }
```

## Conclusion

The Single Responsibility Principle is fundamental to writing clean, maintainable code. By ensuring each class has only one reason to change, you create a codebase that is:

- **Easy to understand** - Each class does one thing clearly
- **Easy to test** - You can test each responsibility in isolation
- **Easy to maintain** - Changes are localized and predictable
- **Easy to extend** - Adding features doesn't break existing code
- **Easy to reuse** - Components are focused and self-contained

Remember: **A class should do one thing and do it well.**
