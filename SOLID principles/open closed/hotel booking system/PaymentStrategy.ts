/**
 * PAYMENT STRATEGY - OPEN/CLOSED PRINCIPLE
 *
 * The PaymentStrategy interface is CLOSED for modification
 * We can add new payment methods by implementing PaymentStrategy
 * without modifying the BookingService
 */

/**
 * Abstract Payment Strategy
 * Responsibility: Define the contract for all payment methods
 *
 * This is CLOSED for modification - it defines the interface
 * This is OPEN for extension - new payment types can implement this
 */
export interface PaymentStrategy {
	processPayment(amount: number): boolean;
	getPaymentMethod(): string;
}

/**
 * Credit Card Payment - IMPLEMENTATION of PaymentStrategy
 * New payment method added without modifying existing code
 */
export class CreditCardPayment implements PaymentStrategy {
	private cardNumber: string;
	private cardholderName: string;
	private cvv: string;

	constructor(cardNumber: string, cardholderName: string, cvv: string) {
		this.cardNumber = cardNumber;
		this.cardholderName = cardholderName;
		this.cvv = cvv;
	}

	processPayment(amount: number): boolean {
		console.log(` Processing Credit Card Payment`);
		console.log(`   Card: ${this.maskCardNumber(this.cardNumber)}`);
		console.log(`   Cardholder: ${this.cardholderName}`);
		console.log(`   Amount: $${amount.toFixed(2)}`);
		console.log(`   Status:  Payment Successful`);
		return true;
	}

	getPaymentMethod(): string {
		return `Credit Card (${this.maskCardNumber(this.cardNumber)})`;
	}

	private maskCardNumber(cardNumber: string): string {
		return `****-****-****-${cardNumber.slice(-4)}`;
	}
}

/**
 * Debit Card Payment - IMPLEMENTATION of PaymentStrategy
 */
export class DebitCardPayment implements PaymentStrategy {
	private cardNumber: string;
	private cardholderName: string;
	private pin: string;

	constructor(cardNumber: string, cardholderName: string, pin: string) {
		this.cardNumber = cardNumber;
		this.cardholderName = cardholderName;
		this.pin = pin;
	}

	processPayment(amount: number): boolean {
		console.log(`   Processing Debit Card Payment`);
		console.log(`   Card: ${this.maskCardNumber(this.cardNumber)}`);
		console.log(`   Cardholder: ${this.cardholderName}`);
		console.log(`   Amount: $${amount.toFixed(2)}`);
		console.log(`   Status:  Payment Successful`);
		return true;
	}

	getPaymentMethod(): string {
		return `Debit Card (${this.maskCardNumber(this.cardNumber)})`;
	}

	private maskCardNumber(cardNumber: string): string {
		return `****-****-****-${cardNumber.slice(-4)}`;
	}
}

/**
 * Digital Wallet Payment (PayPal) - IMPLEMENTATION of PaymentStrategy
 */
export class DigitalWalletPayment implements PaymentStrategy {
	private walletEmail: string;
	private provider: string;

	constructor(walletEmail: string, provider: string = 'PayPal') {
		this.walletEmail = walletEmail;
		this.provider = provider;
	}

	processPayment(amount: number): boolean {
		console.log(`   Processing ${this.provider} Payment`);
		console.log(`   Email: ${this.maskEmail(this.walletEmail)}`);
		console.log(`   Amount: $${amount.toFixed(2)}`);
		console.log(`   Status:  Payment Successful`);
		return true;
	}

	getPaymentMethod(): string {
		return `${this.provider} (${this.maskEmail(this.walletEmail)})`;
	}

	private maskEmail(email: string): string {
		const [name, domain] = email.split('@');
		return `${name.substring(0, 2)}***@${domain}`;
	}
}

/**
 * Bank Transfer - IMPLEMENTATION of PaymentStrategy
 */
export class BankTransferPayment implements PaymentStrategy {
	private accountNumber: string;
	private bankName: string;

	constructor(accountNumber: string, bankName: string) {
		this.accountNumber = accountNumber;
		this.bankName = bankName;
	}

	processPayment(amount: number): boolean {
		console.log(`   Processing Bank Transfer`);
		console.log(`   Bank: ${this.bankName}`);
		console.log(`   Account: ${this.maskAccountNumber(this.accountNumber)}`);
		console.log(`   Amount: $${amount.toFixed(2)}`);
		console.log(`   Status:  Payment Successful`);
		return true;
	}

	getPaymentMethod(): string {
		return `Bank Transfer - ${this.bankName}`;
	}

	private maskAccountNumber(accountNumber: string): string {
		return `****${accountNumber.slice(-4)}`;
	}
}

/**
 * Apple Pay - IMPLEMENTATION of PaymentStrategy
 * Easy to add new payment method without modifying anything
 */
export class ApplePayPayment implements PaymentStrategy {
	private deviceToken: string;

	constructor(deviceToken: string) {
		this.deviceToken = deviceToken;
	}

	processPayment(amount: number): boolean {
		console.log(`   Processing Apple Pay`);
		console.log(`   Device Token: ${this.maskToken(this.deviceToken)}`);
		console.log(`   Amount: $${amount.toFixed(2)}`);
		console.log(`   Status:  Payment Successful`);
		return true;
	}

	getPaymentMethod(): string {
		return `Apple Pay`;
	}

	private maskToken(token: string): string {
		return `${token.substring(0, 8)}...`;
	}
}

/**
 * Google Pay - IMPLEMENTATION of PaymentStrategy
 * Another easy extension without modifying anything
 */
export class GooglePayPayment implements PaymentStrategy {
	private email: string;

	constructor(email: string) {
		this.email = email;
	}

	processPayment(amount: number): boolean {
		console.log(`   Processing Google Pay`);
		console.log(`   Email: ${this.maskEmail(this.email)}`);
		console.log(`   Amount: $${amount.toFixed(2)}`);
		console.log(`   Status:  Payment Successful`);
		return true;
	}

	getPaymentMethod(): string {
		return `Google Pay`;
	}

	private maskEmail(email: string): string {
		const [name, domain] = email.split('@');
		return `${name.substring(0, 2)}***@${domain}`;
	}
}
