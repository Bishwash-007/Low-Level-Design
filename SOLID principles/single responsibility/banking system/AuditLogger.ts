import { Account } from './Account';
import { Transaction } from './Transaction';

/**
 * AuditLogger Class
 * Responsibility: Logs all transactions for audit and compliance
 *
 * This class has a single responsibility: recording transaction history for audit purposes.
 * It does NOT handle:
 * - Account management (delegated to Account)
 * - Transaction processing (delegated to TransactionProcessor)
 * - Notifications (delegated to NotificationService)
 * - Interest calculations (delegated to InterestCalculator)
 *
 * Why is this important?
 * Audit logging requirements may change (storage format, retention policies).
 * We only need to modify this class without affecting transaction processing or account management.
 */

export class AuditLogger {
	private auditLog: Transaction[] = [];

	/**
	 * Logs a transaction for audit purposes
	 * @param transaction The transaction to log
	 */
	logTransaction(transaction: Transaction): void {
		this.auditLog.push(transaction);
		const logEntry = `
AUDIT LOG ENTRY
Transaction ID: ${transaction.transactionId}
Type: ${transaction.type}
From Account: ${transaction.fromAccountNumber}
To Account: ${transaction.toAccountNumber}
Amount: $${transaction.amount.toFixed(2)}
Status: ${transaction.status}
Description: ${transaction.description || 'N/A'}
Timestamp: ${transaction.timestamp.toLocaleString()}
---
`;
		console.log(logEntry);
	}

	/**
	 * Retrieves all audit log entries
	 * @returns Array of all logged transactions
	 */
	getAuditLog(): Transaction[] {
		return [...this.auditLog];
	}

	/**
	 * Retrieves audit log for a specific account
	 * @param accountNumber The account number to filter by
	 * @returns Array of transactions for that account
	 */
	getAccountAuditLog(accountNumber: string): Transaction[] {
		return this.auditLog.filter(
			(t) =>
				t.fromAccountNumber === accountNumber ||
				t.toAccountNumber === accountNumber,
		);
	}

	/**
	 * Gets audit log entries within a date range
	 * @param startDate Start date for filtering
	 * @param endDate End date for filtering
	 * @returns Array of transactions within the date range
	 */
	getAuditLogByDateRange(startDate: Date, endDate: Date): Transaction[] {
		return this.auditLog.filter(
			(t) => t.timestamp >= startDate && t.timestamp <= endDate,
		);
	}

	/**
	 * Generates an audit report
	 * @returns Summary of all transactions
	 */
	generateAuditReport(): string {
		const totalTransactions = this.auditLog.length;
		const completedTransactions = this.auditLog.filter(
			(t) => t.status === 'Completed',
		).length;
		const failedTransactions = this.auditLog.filter(
			(t) => t.status === 'Failed',
		).length;
		const totalAmount = this.auditLog.reduce(
			(sum, t) => (t.status === 'Completed' ? sum + t.amount : sum),
			0,
		);

		return `
AUDIT REPORT
Total Transactions: ${totalTransactions}
Completed: ${completedTransactions}
Failed: ${failedTransactions}
Total Amount Transferred: $${totalAmount.toFixed(2)}
Report Generated: ${new Date().toLocaleString()}
---
`;
	}

	/**
	 * Clears the audit log (use with caution in production)
	 */
	clearAuditLog(): void {
		this.auditLog = [];
		console.log('Audit log cleared');
	}
}
