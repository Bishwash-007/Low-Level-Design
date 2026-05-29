/**
 * SINGLE RESPONSIBILITY PRINCIPLE (SRP) - BANKING SYSTEM DEMONSTRATION
 *
 * This example demonstrates how to properly separate concerns in a banking system
 * by ensuring each class has only one responsibility.
 */

import { Account } from './Account';
import { Transaction } from './Transaction';
import { InterestCalculator } from './InterestCalculator';
import { TransactionProcessor } from './TransactionProcessor';
import { NotificationService } from './NotificationService';
import { AuditLogger } from './AuditLogger';

//  Initialize Services 
// Responsibility separation: Each service handles one specific concern
const processor = new TransactionProcessor();
const calculator = new InterestCalculator();
const notificationService = new NotificationService();
const auditLogger = new AuditLogger();

//  Create Bank Accounts 
// Responsibility: Account class only manages account details
const savingsAccount = new Account('ACC-001', 'Alice Johnson', 'Savings', 5000);
const checkingAccount = new Account('ACC-002', 'Bob Smith', 'Checking', 2000);

console.log('Banking System - Single Responsibility Principle Demo\n');

//  Perform Deposit 
console.log('--- DEPOSIT TRANSACTION ---');
const depositTransaction = new Transaction(
	'TXN-001',
	savingsAccount.accountNumber,
	savingsAccount.accountNumber,
	500,
	'Deposit',
	'Monthly salary deposit',
);
processor.processDeposit(savingsAccount, depositTransaction);
notificationService.sendTransactionNotification(
	savingsAccount,
	'Deposit',
	500,
	'Monthly salary',
);
auditLogger.logTransaction(depositTransaction);

//  Perform Withdrawal 
console.log('\n--- WITHDRAWAL TRANSACTION ---');
const withdrawalTransaction = new Transaction(
	'TXN-002',
	checkingAccount.accountNumber,
	checkingAccount.accountNumber,
	300,
	'Withdrawal',
	'ATM withdrawal',
);
processor.processWithdrawal(checkingAccount, withdrawalTransaction);
notificationService.sendTransactionNotification(
	checkingAccount,
	'Withdrawal',
	300,
	'ATM withdrawal',
);
auditLogger.logTransaction(withdrawalTransaction);

//  Perform Transfer 
console.log('\n--- TRANSFER TRANSACTION ---');
const transferTransaction = new Transaction(
	'TXN-003',
	savingsAccount.accountNumber,
	checkingAccount.accountNumber,
	1000,
	'Transfer',
	'Transfer to checking account',
);
processor.processTransfer(savingsAccount, checkingAccount, transferTransaction);
notificationService.sendTransferNotification(
	savingsAccount,
	checkingAccount.accountNumber,
	1000,
);
auditLogger.logTransaction(transferTransaction);

//  Calculate Interest 
console.log('\n--- INTEREST CALCULATION ---');
const savingsInterest = calculator.calculateMonthlyInterest(savingsAccount);
console.log(
	`Monthly interest for ${savingsAccount.accountHolder}: $${savingsInterest.toFixed(2)}`,
);
savingsAccount.updateBalance(savingsInterest);
notificationService.sendInterestNotification(savingsAccount, savingsInterest);

//  Low Balance Alert 
console.log('\n--- LOW BALANCE ALERT ---');
if (checkingAccount.getBalance() < 500) {
	notificationService.sendLowBalanceAlert(checkingAccount, 500);
}

//  Display Account Information 
console.log('\n--- ACCOUNT INFORMATION ---');
console.log('Savings Account:', savingsAccount.getAccountInfo());
console.log('Checking Account:', checkingAccount.getAccountInfo());

//  Generate Audit Report 
console.log('\n--- AUDIT REPORT ---');
console.log(auditLogger.generateAuditReport());

//  Display Audit Log 
console.log('--- AUDIT LOG FOR SAVINGS ACCOUNT ---');
const savingsAuditLog = auditLogger.getAccountAuditLog(
	savingsAccount.accountNumber,
);
console.log(`Total transactions: ${savingsAuditLog.length}`);
