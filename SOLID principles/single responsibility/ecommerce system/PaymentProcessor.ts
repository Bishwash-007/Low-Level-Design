/**
 * PaymentProcessor Class
 * Responsibility: Handles payment processing and transactions
 *
 * This class has a single responsibility: processing payments.
 * It does NOT handle:
 * - Order management (delegated to Order)
 * - Price calculations (delegated to PricingCalculator)
 * - Invoice generation (delegated to Invoice)
 *
 * Why is this important?
 * If payment logic changes (e.g., payment gateway, validation rules), we only modify this class.
 * Payment logic is isolated from business logic and won't affect other components.
 */
export class PaymentProcessor {
	/**
	 * Processes a payment for the given amount
	 * @param amount The payment amount to process
	 */
	processPayment(amount: number): void {
		console.log(`\nProcessing payment for total: $${amount.toFixed(2)}`);
		// In a real application, this would integrate with a payment gateway
		// (Stripe, PayPal, etc.) and handle transaction security
		console.log('\nPayment processed successfully!');
	}
}
