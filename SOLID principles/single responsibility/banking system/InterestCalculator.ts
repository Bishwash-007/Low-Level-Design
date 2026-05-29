import { Account } from './Account';

/**
 * InterestCalculator Class
 * Responsibility: Calculates interest for bank accounts
 *
 * This class has a single responsibility: calculating interest based on account details.
 * It does NOT handle:
 * - Account management (delegated to Account)
 * - Transaction processing (delegated to TransactionProcessor)
 * - Notifications (delegated to NotificationService)
 * - Audit logging (delegated to AuditLogger)
 *
 * Why is this important?
 * If interest calculation rules change (e.g., different rates for different account types,
 * compound interest logic), we only modify this class. No other part of the system is affected.
 */

export class InterestCalculator {
	private interestRates: { [key: string]: number } = {
		Savings: 0.04, // 4% annual
		Checking: 0.01, // 1% annual
		Business: 0.03, // 3% annual
	};

	/**
	 * Calculates monthly interest for an account
	 * @param account The account to calculate interest for
	 * @returns The interest amount
	 */
	calculateMonthlyInterest(account: Account): number {
		const annualRate = this.interestRates[account.accountType];
		const monthlyRate = annualRate / 12;
		return account.getBalance() * monthlyRate;
	}

	/**
	 * Calculates annual interest for an account
	 * @param account The account to calculate interest for
	 * @returns The interest amount
	 */
	calculateAnnualInterest(account: Account): number {
		const annualRate = this.interestRates[account.accountType];
		return account.getBalance() * annualRate;
	}

	/**
	 * Gets the current interest rate for an account type
	 * @param accountType The type of account
	 * @returns The annual interest rate
	 */
	getInterestRate(accountType: 'Savings' | 'Checking' | 'Business'): number {
		return this.interestRates[accountType];
	}

	/**
	 * Updates the interest rate for an account type
	 * @param accountType The type of account
	 * @param newRate The new annual interest rate
	 */
	setInterestRate(
		accountType: 'Savings' | 'Checking' | 'Business',
		newRate: number,
	): void {
		this.interestRates[accountType] = newRate;
		console.log(
			`Interest rate for ${accountType} updated to ${(newRate * 100).toFixed(2)}%`,
		);
	}
}
