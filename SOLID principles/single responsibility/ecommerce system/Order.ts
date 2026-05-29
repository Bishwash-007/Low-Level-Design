/**
 * Product Class
 * Responsibility: Represents a product with its properties (name, price, id)
 */
export class Product {
	name: string;
	price: number;
	id: number;

	constructor(name: string, price: number, id: number) {
		this.name = name;
		this.price = price;
		this.id = id;
	}
}

/**
 * Order Class
 * Responsibility: Manages the collection of products in an order
 *
 * This class has a single responsibility: managing products within an order.
 * It does NOT handle:
 * - Price calculations (delegated to PricingCalculator)
 * - Invoice generation (delegated to Invoice)
 * - Payment processing (delegated to PaymentProcessor)
 */
export class Order {
	products: Product[];

	constructor() {
		this.products = [];
	}

	/**
	 * Adds a product to the order
	 * @param product The product to add
	 */
	addProduct(product: Product): void {
		this.products.push(product);
	}

	/**
	 * Retrieves all products in the order
	 * @returns Array of products
	 */
	getProducts(): Product[] {
		return this.products;
	}

	/**
	 * Removes a product from the order by its id
	 * @param productId The id of the product to remove
	 */
	removeProduct(productId: number): void {
		this.products = this.products.filter((p) => p.id !== productId);
	}
}
