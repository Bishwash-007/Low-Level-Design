/**
 * Account Class
 * Responsibility: Represents and manages a bank account with basic account information
 *
 * This class has a single responsibility: storing and managing account details.
 * It does NOT handle:
 * - Transaction processing (delegated to TransactionProcessor)
 * - Interest calculations (delegated to InterestCalculator)
 * - Notifications (delegated to NotificationService)
 * - Audit logging (delegated to AuditLogger)
 */

export class Account {
	accountNumber: string;
	accountHolder: string;
	balance: number;
	accountType: 'Savings' | 'Checking' | 'Business';
	createdAt: Date;

	constructor(
		accountNumber: string,
		accountHolder: string,
		accountType: 'Savings' | 'Checking' | 'Business',
		initialBalance: number = 0,
	) {
		this.accountNumber = accountNumber;
		this.accountHolder = accountHolder;
		this.balance = initialBalance;
		this.accountType = accountType;
		this.createdAt = new Date();
	}

	/**
	 * Gets the current balance
	 * @returns The account balance
	 */
	getBalance(): number {
		return this.balance;
	}

	/**
	 * Updates the account balance
	 * @param amount The amount to add (positive) or subtract (negative)
	 */
	updateBalance(amount: number): void {
		this.balance += amount;
	}

	/**
	 * Gets account information
	 * @returns Account details as an object
	 */
	getAccountInfo(): object {
		return {
			accountNumber: this.accountNumber,
			accountHolder: this.accountHolder,
			accountType: this.accountType,
			balance: this.balance,
			createdAt: this.createdAt,
		};
	}
}
