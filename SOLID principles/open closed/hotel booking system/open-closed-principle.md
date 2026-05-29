# Open/Closed Principle (OCP) - Hotel Booking System

## Definition

The **Open/Closed Principle** states that:

> **Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.**

This means:
- **Open for Extension**: You should be able to add new functionality
- **Closed for Modification**: You should NOT need to modify existing code when adding new functionality

## Why is OCP Important?

### 1. **Reduced Risk**
When you extend through new classes instead of modifying existing code, you reduce the risk of breaking existing functionality.

### 2. **Maintainability**
Code changes are isolated to new implementations, making the codebase easier to maintain and understand.

### 3. **Scalability**
New features can be added without touching core business logic, allowing the system to grow without becoming fragile.

### 4. **Reusability**
Stable, closed classes can be reused in multiple contexts without modification.

### 5. **Testing**
New extensions can be tested independently without affecting existing tests.

## How to Achieve OCP

The primary technique is **Polymorphism through Abstraction**:

### 1. **Use Interfaces/Abstract Classes**
Define contracts that describe behavior without implementation details.

### 2. **Use Strategy Pattern**
Encapsulate varying behavior in separate strategy classes.

### 3. **Use Inheritance**
Extend functionality through subclassing rather than modifying the base.

### 4. **Use Composition**
Combine objects to achieve complex behavior without modifying them.

---

## Hotel Booking System Architecture

### System Overview

```
BookingService (CLOSED)
    ↑
    ├─→ Uses Room (OPEN for extension)
    ├─→ Uses PaymentStrategy (OPEN for extension)
    ├─→ Uses PricingStrategy (OPEN for extension)
    └─→ Uses NotificationStrategy (OPEN for extension)
```

### Components

| Component | Type | Status | Purpose |
|-----------|------|--------|---------|
| `BookingService` | Core Service | CLOSED for modification | Orchestrates booking creation, payment, pricing, notifications |
| `Room` | Abstract Base | OPEN for extension | Base class for all room types |
| `PaymentStrategy` | Interface | OPEN for extension | Contract for payment processing |
| `PricingStrategy` | Interface | OPEN for extension | Contract for price calculation |
| `NotificationStrategy` | Interface | OPEN for extension | Contract for sending notifications |

---

## Room Types (Open for Extension)

### Abstract Base Class

```typescript
export abstract class Room {
  abstract getRoomType(): string;
  abstract getPrice(numberOfNights: number): number;
}
```

### Room Type Implementations

All room types extend the `Room` class without modifying it:

1. **BudgetRoom** - Basic rooms at low cost
2. **StandardRoom** - Standard hotel rooms
3. **DeluxeRoom** - Enhanced comfort with premium amenities
4. **SuiteRoom** - Large rooms with living area
5. **Penthouse** - Luxury top-floor accommodations

**Adding a new room type** (e.g., Villa):
```typescript
export class VillaRoom extends Room {
  constructor(roomNumber: string) {
    super(roomNumber, 8, 1200, [...amenities]);
  }

  getRoomType(): string {
    return 'Villa';
  }

  getPrice(numberOfNights: number): number {
    return this.basePricePerNight * numberOfNights * 1.15;
  }
}
```

**No changes needed to `BookingService` or any other class!**

---

## Payment Methods (Open for Extension)

### Strategy Interface

```typescript
export interface PaymentStrategy {
  processPayment(amount: number): boolean;
  getPaymentMethod(): string;
}
```

### Payment Method Implementations

1. **CreditCardPayment** - Process credit card payments
2. **DebitCardPayment** - Process debit card payments
3. **DigitalWalletPayment** - PayPal and similar wallets
4. **BankTransferPayment** - Direct bank transfers
5. **ApplePayPayment** - Apple Pay integration
6. **GooglePayPayment** - Google Pay integration

**Adding a new payment method** (e.g., Cryptocurrency):
```typescript
export class CryptoPayment implements PaymentStrategy {
  processPayment(amount: number): boolean {
    console.log(`Processing Bitcoin payment for $${amount}`);
    return true;
  }

  getPaymentMethod(): string {
    return 'Cryptocurrency';
  }
}
```

**Use it immediately:**
```typescript
const payment = new CryptoPayment();
bookingService.createBooking(guest, room, ..., payment, ...);
```

---

## Pricing Strategies (Open for Extension)

### Strategy Interface

```typescript
export interface PricingStrategy {
  calculatePrice(basePrice: number, numberOfNights: number): number;
  getStrategyName(): string;
}
```

### Pricing Strategy Implementations

1. **StandardPricing** - No discount
2. **EarlyBirdPricing** - Discount for advance bookings
3. **WeekendSurchargePricing** - Extra charge for weekends
4. **LongStayPricing** - Progressive discounts for longer stays
5. **SeasonalPricing** - Peak vs off-season rates
6. **GroupBookingPricing** - Discounts for multiple rooms
7. **MemberLoyaltyPricing** - VIP member discounts

**Adding a new pricing strategy** (e.g., Holiday Special):
```typescript
export class HolidaySpecialPricing implements PricingStrategy {
  calculatePrice(basePrice: number, numberOfNights: number): number {
    const discount = basePrice * numberOfNights * 0.3;
    return basePrice * numberOfNights * 0.7;
  }

  getStrategyName(): string {
    return 'Holiday Special - 30% Off';
  }
}
```

---

## Notification Channels (Open for Extension)

### Strategy Interface

```typescript
export interface NotificationStrategy {
  sendNotification(recipient: string, subject: string, message: string): boolean;
  getNotificationType(): string;
}
```

### Notification Implementation

1. **EmailNotification** - Send via email
2. **SmsNotification** - Send via SMS
3. **PushNotification** - Send as app push notification
4. **WhatsAppNotification** - Send via WhatsApp
5. **TelegramNotification** - Send via Telegram
6. **SlackNotification** - Send to Slack channel

**Adding a new notification channel** (e.g., Discord):
```typescript
export class DiscordNotification implements NotificationStrategy {
  sendNotification(recipient: string, subject: string, message: string): boolean {
    console.log(`Sending Discord notification to ${recipient}`);
    return true;
  }

  getNotificationType(): string {
    return 'Discord';
  }
}
```

---

## BookingService (Closed for Modification)

### Core Method - Accepts Strategies

```typescript
createBooking(
  guest: Guest,
  room: Room,
  checkInDate: Date,
  checkOutDate: Date,
  paymentStrategy: PaymentStrategy,    // ← Strategy pattern
  pricingStrategy: PricingStrategy,    // ← Strategy pattern
  notificationStrategy: NotificationStrategy,  // ← Strategy pattern
): Booking | null {
  // Booking creation logic
}
```

**This method is CLOSED:**
- It doesn't change when new payment methods are added
- It doesn't change when new pricing strategies are added
- It doesn't change when new notification channels are added

**But it's OPEN to extension:**
- Accept ANY implementation of PaymentStrategy
- Accept ANY implementation of PricingStrategy
- Accept ANY implementation of NotificationStrategy

---

## Usage Examples

### Example 1: Standard Booking with Credit Card

```typescript
const payment = new CreditCardPayment('4111111111111111', 'Alice', '123');
const pricing = new StandardPricing();
const notification = new EmailNotification();

bookingService.createBooking(guest, room, checkIn, checkOut, payment, pricing, notification);
```

### Example 2: Early Bird with Digital Wallet

```typescript
const payment = new DigitalWalletPayment('alice@paypal.com');
const pricing = new EarlyBirdPricing(45); // 45 days in advance
const notification = new WhatsAppNotification('555-1234');

bookingService.createBooking(guest, room, checkIn, checkOut, payment, pricing, notification);
```

### Example 3: Long Stay with Loyalty Program

```typescript
const payment = new ApplePayPayment('device-token');
const pricing = new MemberLoyaltyPricing('platinum');
const notification = new SmsNotification();

bookingService.createBooking(guest, room, checkIn, checkOut, payment, pricing, notification);
```

---

## Benefits Demonstrated

### 1. **Adding New Room Type - No Code Changes**

```typescript
// Just create a new class
export class VillaRoom extends Room { /* ... */ }

// Use immediately without modifying anything
bookingService.createBooking(..., new VillaRoom('V01'), ...);
```

### 2. **Adding New Payment Method - No Code Changes**

```typescript
// Just create a new class
export class CryptoPayment implements PaymentStrategy { /* ... */ }

// Use immediately without modifying anything
bookingService.createBooking(..., new CryptoPayment(), ...);
```

### 3. **Adding New Pricing Strategy - No Code Changes**

```typescript
// Just create a new class
export class FlashSalePricing implements PricingStrategy { /* ... */ }

// Use immediately without modifying anything
bookingService.createBooking(..., new FlashSalePricing(), ...);
```

### 4. **Adding New Notification Channel - No Code Changes**

```typescript
// Just create a new class
export class DiscordNotification implements NotificationStrategy { /* ... */ }

// Use immediately without modifying anything
bookingService.createBooking(..., new DiscordNotification(), ...);
```

---

## Comparison: Violating vs Following OCP

###  Violating OCP (Hard to Extend)

```typescript
class BookingService {
  processPayment(bookingType: string, amount: number): boolean {
    if (bookingType === 'credit_card') {
      // Process credit card
    } else if (bookingType === 'debit_card') {
      // Process debit card
    } else if (bookingType === 'wallet') {
      // Process wallet
    }
    // PROBLEM: Add a new payment type? Modify this code!
    // PROBLEM: Hard to test individual payment types
    // PROBLEM: Risk of breaking existing logic
  }
}
```

###  Following OCP (Easy to Extend)

```typescript
class BookingService {
  createBooking(
    guest: Guest,
    room: Room,
    checkInDate: Date,
    checkOutDate: Date,
    paymentStrategy: PaymentStrategy,
    pricingStrategy: PricingStrategy,
    notificationStrategy: NotificationStrategy,
  ): Booking {
    // Use strategies polymorphically
    const success = paymentStrategy.processPayment(amount);
    const price = pricingStrategy.calculatePrice(base, nights);
    notificationStrategy.sendNotification(recipient, subject, message);
    // BENEFIT: Add new payment type? No changes needed!
    // BENEFIT: Easy to test individual strategies
    // BENEFIT: No risk to existing code
  }
}
```

---

## Real-World Scenarios

### Scenario 1: New Payment Method Required

**Requirement:** Support cryptocurrency payments

**Without OCP:** Modify `BookingService` to add cryptocurrency handling

**With OCP:**
```typescript
export class CryptoPayment implements PaymentStrategy { /* ... */ }
// Use immediately - no changes to BookingService!
```

### Scenario 2: New Discount Strategy

**Requirement:** Add flash sale pricing (70% off for 2 hours)

**Without OCP:** Modify pricing logic in `BookingService`

**With OCP:**
```typescript
export class FlashSalePricing implements PricingStrategy { /* ... */ }
// Use immediately - no changes to BookingService!
```

### Scenario 3: New Notification Channel

**Requirement:** Send notifications via Discord

**Without OCP:** Add Discord handling to notification logic

**With OCP:**
```typescript
export class DiscordNotification implements NotificationStrategy { /* ... */ }
// Use immediately - no changes to BookingService!
```

---

## Design Patterns Used

### 1. **Strategy Pattern**
Each strategy (payment, pricing, notification) is interchangeable and can be selected at runtime.

### 2. **Template Method Pattern**
Abstract `Room` class provides template; subclasses implement specific behaviors.

### 3. **Dependency Injection**
Strategies are injected into `BookingService` rather than being created internally.

### 4. **Interface Segregation**
Each strategy interface has a focused, minimal contract.

---

## Common OCP Violations to Avoid

###  Large If-Else Chains
```typescript
if (type === 'A') { /* ... */ }
else if (type === 'B') { /* ... */ }
else if (type === 'C') { /* ... */ }
// Hard to extend, prone to errors
```

###  Switch Statements for Behavior
```typescript
switch (paymentMethod) {
  case 'credit': // ... break;
  case 'debit': // ... break;
  // Add new method? Modify this code!
}
```

###  Inheritance Hierarchies That Are Fragile
```typescript
class Room {
  calculatePrice(roomType: string) { /* ... */ }
}
// Modifying this affects all subclasses
```

---

## Best Practices for OCP

 **Use Abstract Base Classes and Interfaces**
 **Apply Strategy Pattern**
 **Use Composition over Inheritance**
 **Depend on Abstractions, not Concretions**
 **Keep Classes Focused and Cohesive**
 **Use Dependency Injection**
 **Design for Change**
 **Avoid Premature Coupling**

---

## Conclusion

The Open/Closed Principle makes software systems:

- **More Flexible**: Add features without touching core code
- **More Robust**: Less risk of breaking existing functionality
- **More Maintainable**: Changes are localized to new implementations
- **More Testable**: Each strategy can be tested independently
- **More Scalable**: System grows through extension, not modification

Remember: **Open for extension, closed for modification!**

---

This demonstrates multiple bookings using different combinations of:
- Room types
- Payment methods
- Pricing strategies
- Notification channels

All working together without modifying the `BookingService`!
