import { Product } from './Order';

/**
 * PricingCalculator Class
 * Responsibility: Handles all pricing calculations and logic
 *
 * This class has a single responsibility: calculating prices based on products.
 * It does NOT handle:
 * - Order management (delegated to Order)
 * - Invoice generation (delegated to Invoice)
 * - Payment processing (delegated to PaymentProcessor)
 *
 * Why is this important?
 * If pricing logic changes (e.g., tax calculation, discounts), we only need to modify this class.
 * Changes to pricing logic won't affect other parts of the system.
 */
export class PricingCalculator {
	/**
	 * Calculates the total price of all products
	 * @param products Array of products to calculate total for
	 * @returns The sum of all product prices
	 */
	calculateTotal(products: Product[]): number {
		return products.reduce((total, product) => total + product.price, 0);
	}

	/**
	 * Example method showing how to extend pricing logic
	 * Calculates total with a discount percentage
	 * @param products Array of products
	 * @param discountPercent Discount percentage (0-100)
	 * @returns Total price after discount
	 */
	calculateTotalWithDiscount(
		products: Product[],
		discountPercent: number,
	): number {
		const total = this.calculateTotal(products);
		return total * (1 - discountPercent / 100);
	}
}
