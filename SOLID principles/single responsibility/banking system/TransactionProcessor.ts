import { Account } from './Account';
import { Transaction } from './Transaction';

/**
 * TransactionProcessor Class
 * Responsibility: Processes financial transactions
 *
 * This class has a single responsibility: processing transactions.
 * It does NOT handle:
 * - Account management (delegated to Account)
 * - Notifications (delegated to NotificationService)
 * - Audit logging (delegated to AuditLogger)
 * - Interest calculations (delegated to InterestCalculator)
 *
 * Why is this important?
 * Transaction processing logic (validation, balance updates, error handling) is isolated.
 * Changes to transaction rules won't affect account management or notifications.
 */

export class TransactionProcessor {
	private minimumBalance: number = 100;

	/**
	 * Processes a deposit transaction
	 * @param account The account to deposit to
	 * @param transaction The transaction to process
	 * @returns true if successful, false otherwise
	 */
	processDeposit(account: Account, transaction: Transaction): boolean {
		try {
			if (transaction.amount <= 0) {
				console.log('Deposit amount must be positive');
				transaction.markAsFailed();
				return false;
			}

			account.updateBalance(transaction.amount);
			transaction.markAsCompleted();
			console.log(
				`Deposit of $${transaction.amount} completed. New balance: $${account.getBalance().toFixed(2)}`,
			);
			return true;
		} catch (error) {
			transaction.markAsFailed();
			return false;
		}
	}

	/**
	 * Processes a withdrawal transaction
	 * @param account The account to withdraw from
	 * @param transaction The transaction to process
	 * @returns true if successful, false otherwise
	 */
	processWithdrawal(account: Account, transaction: Transaction): boolean {
		try {
			if (transaction.amount <= 0) {
				console.log('Withdrawal amount must be positive');
				transaction.markAsFailed();
				return false;
			}

			if (account.getBalance() - transaction.amount < this.minimumBalance) {
				console.log(
					`Insufficient balance. Minimum balance of $${this.minimumBalance} required.`,
				);
				transaction.markAsFailed();
				return false;
			}

			account.updateBalance(-transaction.amount);
			transaction.markAsCompleted();
			console.log(
				`Withdrawal of $${transaction.amount} completed. New balance: $${account.getBalance().toFixed(2)}`,
			);
			return true;
		} catch (error) {
			transaction.markAsFailed();
			return false;
		}
	}

	/**
	 * Processes a transfer between two accounts
	 * @param fromAccount The source account
	 * @param toAccount The destination account
	 * @param transaction The transaction to process
	 * @returns true if successful, false otherwise
	 */
	processTransfer(
		fromAccount: Account,
		toAccount: Account,
		transaction: Transaction,
	): boolean {
		try {
			if (transaction.amount <= 0) {
				console.log('Transfer amount must be positive');
				transaction.markAsFailed();
				return false;
			}

			if (fromAccount.getBalance() - transaction.amount < this.minimumBalance) {
				console.log(
					`Insufficient balance. Minimum balance of $${this.minimumBalance} required.`,
				);
				transaction.markAsFailed();
				return false;
			}

			fromAccount.updateBalance(-transaction.amount);
			toAccount.updateBalance(transaction.amount);
			transaction.markAsCompleted();
			console.log(
				`Transfer of $${transaction.amount} from ${fromAccount.accountNumber} to ${toAccount.accountNumber} completed`,
			);
			return true;
		} catch (error) {
			transaction.markAsFailed();
			return false;
		}
	}

	/**
	 * Sets the minimum balance requirement
	 * @param amount The minimum balance amount
	 */
	setMinimumBalance(amount: number): void {
		this.minimumBalance = amount;
	}

	/**
	 * Gets the current minimum balance requirement
	 * @returns The minimum balance
	 */
	getMinimumBalance(): number {
		return this.minimumBalance;
	}
}
