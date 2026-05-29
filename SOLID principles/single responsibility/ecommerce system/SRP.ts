/**
 * SINGLE RESPONSIBILITY PRINCIPLE (SRP) DEMONSTRATION
 * 
 * The Single Responsibility Principle states that a class should have only one reason to change,
 * meaning it should have only one responsibility. This example demonstrates how to properly
 * separate concerns in an e-commerce order management system.
 */

import { Invoice } from './Invoice';
import { Order, Product } from './Order';
import { PaymentProcessor } from './PaymentProcessor';
import { PricingCalculator } from './PricingCalculator';

// Create sample products
const product1 = new Product('Laptop', 1200, 1);
const product2 = new Product('Mouse', 25, 2);

// Create an order and add products to it
// Responsibility: Order class manages the collection of products
const order = new Order();
order.addProduct(product1);
order.addProduct(product2);

// Calculate the total price
// Responsibility: PricingCalculator handles all pricing logic
const pricingCalculator = new PricingCalculator();
const total = pricingCalculator.calculateTotal(order.getProducts());

// Generate an invoice for the order
// Responsibility: Invoice class handles invoice generation and formatting
const invoice = new Invoice();
invoice.generateInvoice(order.getProducts(), total);

// Process the payment
// Responsibility: PaymentProcessor handles payment transactions
const paymentProcessor = new PaymentProcessor();
paymentProcessor.processPayment(total);
