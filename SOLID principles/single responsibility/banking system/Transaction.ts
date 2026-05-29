/**
 * Transaction Class
 * Responsibility: Represents a banking transaction
 *
 * This class has a single responsibility: representing transaction data.
 * It does NOT handle:
 * - Processing transactions (delegated to TransactionProcessor)
 * - Notifications (delegated to NotificationService)
 * - Audit logging (delegated to AuditLogger)
 */

export class Transaction {
	transactionId: string;
	fromAccountNumber: string;
	toAccountNumber: string;
	amount: number;
	type: 'Deposit' | 'Withdrawal' | 'Transfer';
	status: 'Pending' | 'Completed' | 'Failed';
	timestamp: Date;
	description: string;

	constructor(
		transactionId: string,
		fromAccountNumber: string,
		toAccountNumber: string,
		amount: number,
		type: 'Deposit' | 'Withdrawal' | 'Transfer',
		description: string = '',
	) {
		this.transactionId = transactionId;
		this.fromAccountNumber = fromAccountNumber;
		this.toAccountNumber = toAccountNumber;
		this.amount = amount;
		this.type = type;
		this.status = 'Pending';
		this.timestamp = new Date();
		this.description = description;
	}

	/**
	 * Marks transaction as completed
	 */
	markAsCompleted(): void {
		this.status = 'Completed';
	}

	/**
	 * Marks transaction as failed
	 */
	markAsFailed(): void {
		this.status = 'Failed';
	}

	/**
	 * Gets transaction details
	 * @returns Transaction information
	 */
	getTransactionDetails(): object {
		return {
			transactionId: this.transactionId,
			fromAccountNumber: this.fromAccountNumber,
			toAccountNumber: this.toAccountNumber,
			amount: this.amount,
			type: this.type,
			status: this.status,
			timestamp: this.timestamp,
			description: this.description,
		};
	}
}
