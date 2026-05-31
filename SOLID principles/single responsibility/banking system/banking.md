# Banking System - Single Responsibility Principle Example

## Overview

This banking system demonstrates the Single Responsibility Principle in a real-world context. Each class in the system has exactly one responsibility and one reason to change.

## System Architecture

### Class Responsibilities

| Class | Responsibility | Reason to Change |
|-------|-----------------|-----------------|
| `Account` | Manage account details and balance | Account structure changes |
| `Transaction` | Represent transaction data | Transaction data structure changes |
| `TransactionProcessor` | Process financial transactions | Transaction processing rules change |
| `InterestCalculator` | Calculate interest on accounts | Interest calculation rules change |
| `NotificationService` | Send notifications to customers | Notification channels or format change |
| `AuditLogger` | Log transactions for compliance | Audit requirements or storage format change |

## Classes in Detail

### 1. Account Class

**Responsibility:** Store and manage bank account information

```typescript
export class Account {
  accountNumber: string;
  accountHolder: string;
  balance: number;
  accountType: 'Savings' | 'Checking' | 'Business';
  createdAt: Date;

  getBalance(): number
  updateBalance(amount: number): void
  getAccountInfo(): object
}
```

**What it does:**
- Stores account details
- Manages balance updates
- Provides account information

**What it does NOT do:**
- Process transactions
- Calculate interest
- Send notifications
- Log audit entries

**Why this separation matters:**
If account structure changes (e.g., adding account pins, overdraft limits), only this class needs modification.

---

### 2. Transaction Class

**Responsibility:** Represent a financial transaction

```typescript
export class Transaction {
  transactionId: string;
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  type: 'Deposit' | 'Withdrawal' | 'Transfer';
  status: 'Pending' | 'Completed' | 'Failed';
  timestamp: Date;

  markAsCompleted(): void
  markAsFailed(): void
  getTransactionDetails(): object
}
```

**What it does:**
- Stores transaction data
- Tracks transaction status
- Provides transaction information

**What it does NOT do:**
- Process the transaction
- Update accounts
- Send notifications
- Validate amounts

**Why this separation matters:**
Transaction data structure is separate from transaction logic, making data handling independent from processing rules.

---

### 3. TransactionProcessor Class

**Responsibility:** Process financial transactions

```typescript
export class TransactionProcessor {
  processDeposit(account: Account, transaction: Transaction): boolean
  processWithdrawal(account: Account, transaction: Transaction): boolean
  processTransfer(fromAccount: Account, toAccount: Account, transaction: Transaction): boolean
  setMinimumBalance(amount: number): void
}
```

**What it does:**
- Validates transaction amounts
- Checks account balance
- Updates account balances
- Enforces minimum balance requirements
- Marks transactions as completed or failed

**What it does NOT do:**
- Store account data (delegated to Account)
- Send notifications (delegated to NotificationService)
- Log transactions (delegated to AuditLogger)
- Calculate interest (delegated to InterestCalculator)

**Why this separation matters:**
If transaction rules change (minimum balance, overdraft policies, transaction limits), only this class needs modification. Account management, notifications, and interest calculations remain untouched.

---

### 4. InterestCalculator Class

**Responsibility:** Calculate interest for accounts

```typescript
export class InterestCalculator {
  calculateMonthlyInterest(account: Account): number
  calculateAnnualInterest(account: Account): number
  getInterestRate(accountType: string): number
  setInterestRate(accountType: string, newRate: number): void
}
```

**What it does:**
- Stores interest rates for different account types
- Calculates monthly interest
- Calculates annual interest
- Updates interest rates

**What it does NOT do:**
- Manage accounts
- Process transactions
- Send notifications
- Log audit entries

**Why this separation matters:**
If interest calculation rules change (compound interest, tiered rates based on balance), only this class is affected.

---

### 5. NotificationService Class

**Responsibility:** Send notifications to customers

```typescript
export class NotificationService {
  sendTransactionNotification(account: Account, ...): void
  sendLowBalanceAlert(account: Account, threshold: number): void
  sendInterestNotification(account: Account, interestAmount: number): void
  sendTransferNotification(fromAccount: Account, toAccountNumber: string, amount: number): void
}
```

**What it does:**
- Formats notification messages
- Sends transaction notifications
- Sends alert notifications
- Sends interest credit notifications

**What it does NOT do:**
- Manage accounts
- Process transactions
- Calculate interest
- Log audit entries

**Why this separation matters:**
If notification channels change (email to SMS, adding push notifications, changing message format), only this class needs modification. No other system is affected.

---

### 6. AuditLogger Class

**Responsibility:** Log transactions for compliance and auditing

```typescript
export class AuditLogger {
  logTransaction(transaction: Transaction): void
  getAuditLog(): Transaction[]
  getAccountAuditLog(accountNumber: string): Transaction[]
  getAuditLogByDateRange(startDate: Date, endDate: Date): Transaction[]
  generateAuditReport(): string
}
```

**What it does:**
- Records all transactions
- Maintains audit trail
- Filters audit logs by account or date range
- Generates audit reports

**What it does NOT do:**
- Manage accounts
- Process transactions
- Send notifications
- Calculate interest

**Why this separation matters:**
If audit requirements change (storage format, retention policies, reporting format), only this class needs modification.

---

## Example Usage Flow

```typescript
// 1. Create accounts (Account responsibility)
const savingsAccount = new Account('ACC-001', 'Alice Johnson', 'Savings', 5000);

// 2. Create a transaction object (Transaction responsibility)
const transaction = new Transaction(
  'TXN-001',
  savingsAccount.accountNumber,
  savingsAccount.accountNumber,
  500,
  'Deposit',
  'Monthly salary'
);

// 3. Process the transaction (TransactionProcessor responsibility)
processor.processDeposit(savingsAccount, transaction);

// 4. Send notification (NotificationService responsibility)
notificationService.sendTransactionNotification(
  savingsAccount,
  'Deposit',
  500,
  'Monthly salary'
);

// 5. Log the transaction (AuditLogger responsibility)
auditLogger.logTransaction(transaction);

// 6. Calculate interest (InterestCalculator responsibility)
const interest = calculator.calculateMonthlyInterest(savingsAccount);
savingsAccount.updateBalance(interest);
```

## Benefits of This Design

### 1. **Easy Maintenance**
Each class has a clear, single responsibility. Changes are localized and predictable.

```typescript
// If we need to change interest calculation, we only modify InterestCalculator
calculator.setInterestRate('Savings', 0.05); // Changed from 4% to 5%
// No other classes are affected!
```

### 2. **Easy Testing**
Each class can be tested independently with minimal mocking.

```typescript
// Test transaction processor without account management complexity
const testTransaction = processor.processDeposit(testAccount, depositTxn);
expect(testAccount.getBalance()).toBe(5500);
```

### 3. **Easy Extension**
Adding new features doesn't break existing code.

```typescript
// Add email notifications without affecting SMS notifications
class ExtendedNotificationService extends NotificationService {
  sendEmailNotification(account: Account, message: string): void {
    // Email implementation
  }
}
```

### 4. **Easy Reusability**
Components can be reused in different contexts.

```typescript
// Use InterestCalculator in a different system
const calculator = new InterestCalculator();
const interest = calculator.calculateMonthlyInterest(anyAccount);
```

### 5. **Easy Debugging**
When something goes wrong, you know exactly which class to check.

```typescript
// If balance is wrong  Check Account and TransactionProcessor
// If notification didn't arrive  Check NotificationService
// If audit log is empty  Check AuditLogger
// If interest is miscalculated  Check InterestCalculator
```

## Real-World Scenarios

### Scenario 1: Change Interest Calculation
**Challenge:** Bank decides to implement compound interest

**Solution:** Modify only `InterestCalculator`
```typescript
calculateMonthlyInterest(account: Account): number {
  const previousBalance = this.getLastMonthBalance(account.accountNumber);
  const annualRate = this.interestRates[account.accountType];
  const monthlyRate = annualRate / 12;
  return previousBalance * monthlyRate; // Compound calculation
}
```
**Impact:** Zero impact on other classes

---

### Scenario 2: Add SMS Notifications
**Challenge:** Bank wants SMS alerts in addition to email

**Solution:** Extend `NotificationService`
```typescript
sendSmsNotification(phoneNumber: string, message: string): void {
  // SMS integration
}
```
**Impact:** Zero impact on transaction processing or audit logging

---

### Scenario 3: Change Audit Storage
**Challenge:** Bank switches from in-memory to database storage

**Solution:** Modify only `AuditLogger`
```typescript
logTransaction(transaction: Transaction): void {
  // Save to database instead of array
  database.insert('audit_logs', transaction);
}
```
**Impact:** Zero impact on account management or transaction processing

---

### Scenario 4: Stricter Validation
**Challenge:** Bank adds new validation rules for transactions

**Solution:** Modify only `TransactionProcessor`
```typescript
processWithdrawal(account: Account, transaction: Transaction): boolean {
  // Add geolocation check
  // Add fraud detection
  // Add time-based restrictions
}
```
**Impact:** Zero impact on notifications or interest calculations

---

## Anti-Patterns to Avoid

###  God Class (Multiple Responsibilities)
```typescript
// DON'T DO THIS - violates SRP
class BankingService {
  processTransaction() { }
  calculateInterest() { }
  sendNotification() { }
  logAudit() { }
  manageAccount() { }
}
```

###  Mixed Concerns
```typescript
// DON'T DO THIS - Transaction and Account mixed
class Account {
  processDeposit() { } // ← Not a responsibility
  processWithdrawal() { } // ← Not a responsibility
  calculateInterest() { } // ← Not a responsibility
  sendNotification() { } // ← Not a responsibility
}
```

## Best Practices Applied

 **Each class has ONE reason to change**
 **Dependencies flow from high-level to low-level**
 **Easy to test each component independently**
 **Easy to extend without modifying existing code**
 **Clear separation of concerns**
 **High cohesion within classes**
 **Low coupling between classes**

## Running the Example

```bash
npx tsx BankingSystem.ts
```

This will demonstrate:
1. Creating accounts
2. Processing deposits, withdrawals, and transfers
3. Calculating interest
4. Sending notifications
5. Logging transactions
6. Generating audit reports

All while maintaining clear separation of responsibilities!

## Key Takeaways

1. **Single Responsibility Principle** is about organizing code into logical, focused units
2. Each class should have **only one reason to change**
3. This makes code **easier to understand, test, maintain, and extend**
4. Apply SRP at **class, method, and module levels**
5. Balance between **over-engineering (too many classes) and under-engineering (too few responsibilities)**

Remember: **A class should do one thing and do it well!**
