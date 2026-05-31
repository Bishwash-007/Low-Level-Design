import { Product } from './Order';

/**
 * Invoice Class
 * Responsibility: Handles invoice generation and formatting
 *
 * This class has a single responsibility: generating and displaying invoices.
 * It does NOT handle:
 * - Price calculations (delegated to PricingCalculator)
 * - Order management (delegated to Order)
 * - Payment processing (delegated to PaymentProcessor)
 */
export class Invoice {
	/**
	 * Generates and displays an invoice for the given products and total amount
	 * @param products Array of products to include in the invoice
	 * @param amount Total amount for the invoice
	 */
	generateInvoice(products: Product[], amount: number): void {
		console.log(
			'==\n' +
				'          INVOICE\n' +
				'==\n' +
				products.map((p) => `- ${p.name}: $${p.price.toFixed(2)}`).join('\n') +
				`\n--------------------------------\n` +
				`Total: $${amount.toFixed(2)}\n` +
				'==',
		);
	}
}
