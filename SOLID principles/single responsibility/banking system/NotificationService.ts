import { Account } from './Account';

/**
 * NotificationService Class
 * Responsibility: Sends notifications to customers
 *
 * This class has a single responsibility: handling all customer notifications.
 * It does NOT handle:
 * - Account management (delegated to Account)
 * - Transaction processing (delegated to TransactionProcessor)
 * - Interest calculations (delegated to InterestCalculator)
 * - Audit logging (delegated to AuditLogger)
 *
 * Why is this important?
 * If notification channels change (email, SMS, push notifications), we only modify this class.
 * The notification logic is isolated from business logic.
 */

export class NotificationService {
	/**
	 * Sends a transaction notification
	 * @param account The account involved in the transaction
	 * @param transactionType Type of transaction
	 * @param amount The transaction amount
	 * @param message Additional message
	 */
	sendTransactionNotification(
		account: Account,
		transactionType: string,
		amount: number,
		message: string = '',
	): void {
		const notification = `
TRANSACTION NOTIFICATION
Account: ${account.accountNumber}
Holder: ${account.accountHolder}
Type: ${transactionType}
Amount: $${amount.toFixed(2)}
New Balance: $${account.getBalance().toFixed(2)}
${message ? `Message: ${message}` : ''}
Time: ${new Date().toLocaleString()}
---
`;
		console.log(notification);
	}

	/**
	 * Sends a low balance alert
	 * @param account The account with low balance
	 * @param threshold The balance threshold
	 */
	sendLowBalanceAlert(account: Account, threshold: number): void {
		const alert = `
LOW BALANCE ALERT
Account: ${account.accountNumber}
Holder: ${account.accountHolder}
Current Balance: $${account.getBalance().toFixed(2)}
Threshold: $${threshold.toFixed(2)}
---
`;
		console.log(alert);
	}

	/**
	 * Sends an interest credit notification
	 * @param account The account that received interest
	 * @param interestAmount The interest amount credited
	 */
	sendInterestNotification(account: Account, interestAmount: number): void {
		const notification = `
INTEREST CREDIT NOTIFICATION
Account: ${account.accountNumber}
Holder: ${account.accountHolder}
Interest Credited: $${interestAmount.toFixed(2)}
New Balance: $${account.getBalance().toFixed(2)}
Time: ${new Date().toLocaleString()}
---
`;
		console.log(notification);
	}

	/**
	 * Sends a transfer notification
	 * @param fromAccount The source account
	 * @param toAccountNumber The destination account number
	 * @param amount The transfer amount
	 */
	sendTransferNotification(
		fromAccount: Account,
		toAccountNumber: string,
		amount: number,
	): void {
		const notification = `
TRANSFER NOTIFICATION
From Account: ${fromAccount.accountNumber}
To Account: ${toAccountNumber}
Amount: $${amount.toFixed(2)}
New Balance: $${fromAccount.getBalance().toFixed(2)}
Time: ${new Date().toLocaleString()}
---
`;
		console.log(notification);
	}
}
