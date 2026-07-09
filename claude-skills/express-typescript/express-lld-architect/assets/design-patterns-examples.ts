// Design Patterns Implementation Examples for Express.js + TypeScript
// Production-ready with comprehensive error handling and validation

// ============ FACTORY PATTERN (With Validation & Error Handling) ============

interface NotificationService {
	send(message: string, recipient: string): Promise<void>;
	validate(recipient: string): boolean;
}

class EmailNotification implements NotificationService {
	validate(recipient: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(recipient);
	}

	async send(message: string, recipient: string): Promise<void> {
		if (!message || !recipient) {
			throw new Error('Message and recipient are required');
		}

		if (!this.validate(recipient)) {
			throw new Error(`Invalid email format: ${recipient}`);
		}

		// Sanitize and log
		const sanitizedMessage = message.slice(0, 1000);
		console.log(
			`[EMAIL] Sending to ${recipient}: ${sanitizedMessage.substring(0, 50)}...`,
		);
		// TODO: Implement actual email sending with retry logic
	}
}

class SMSNotification implements NotificationService {
	validate(recipient: string): boolean {
		const phoneRegex = /^\+?[1-9]\d{1,14}$/;
		return phoneRegex.test(recipient);
	}

	async send(message: string, recipient: string): Promise<void> {
		if (!message || !recipient) {
			throw new Error('Message and recipient are required');
		}

		if (!this.validate(recipient)) {
			throw new Error(`Invalid phone format: ${recipient}`);
		}

		if (message.length > 160) {
			throw new Error('SMS message exceeds 160 characters');
		}

		console.log(
			`[SMS] Sending to ${recipient}: ${message.substring(0, 50)}...`,
		);
		// TODO: Implement actual SMS sending with retry logic
	}
}

class PushNotification implements NotificationService {
	validate(recipient: string): boolean {
		// Device ID validation
		return recipient.length > 0 && recipient.length <= 255;
	}

	async send(message: string, recipient: string): Promise<void> {
		if (!message || !recipient) {
			throw new Error('Message and recipient (device ID) are required');
		}

		if (!this.validate(recipient)) {
			throw new Error(`Invalid device ID: ${recipient}`);
		}

		console.log(
			`[PUSH] Sending to device ${recipient}: ${message.substring(0, 50)}...`,
		);
		// TODO: Implement actual push notification sending
	}
}

class NotificationFactory {
	static createNotification(type: string): NotificationService {
		switch (type.toLowerCase()) {
			case 'email':
				return new EmailNotification();
			case 'sms':
				return new SMSNotification();
			case 'push':
				return new PushNotification();
			default:
				throw new Error(
					`Unknown notification type: ${type}. Supported types: email, sms, push`,
				);
		}
	}

	static getSupportedTypes(): string[] {
		return ['email', 'sms', 'push'];
	}
}

// Usage with error handling
async function notificationExample() {
	try {
		const emailService = NotificationFactory.createNotification('email');
		await emailService.send('Hello World', 'user@example.com');
	} catch (error) {
		console.error('Notification failed:', (error as Error).message);
	}
}

// ============ BUILDER PATTERN (With Validation & Immutability) ============

interface QueryFilter {
	field: string;
	operator: string;
	value: any;
}

interface QueryOptions {
	filters: QueryFilter[];
	sortBy: string;
	limit: number;
	offset: number;
}

class QueryBuilder {
	private filters: QueryFilter[] = [];
	private sortBy: string = '';
	private limit: number = 10;
	private offset: number = 0;

	private readonly MAX_LIMIT = 1000;
	private readonly MIN_OFFSET = 0;
	private readonly MIN_LIMIT = 1;

	where(field: string, operator: string, value: any): this {
		if (!field || field.trim().length === 0) {
			throw new Error('Field name is required');
		}

		if (
			!operator ||
			!['=', '!=', '>', '<', '>=', '<=', 'IN', 'LIKE'].includes(operator)
		) {
			throw new Error(`Invalid operator: ${operator}`);
		}

		if (value === undefined || value === null) {
			throw new Error('Filter value is required');
		}

		// Sanitize field name to prevent SQL injection
		const sanitizedField = field.replace(/[^a-zA-Z0-9_]/g, '');
		if (sanitizedField !== field) {
			console.warn(`Field name sanitized: ${field} -> ${sanitizedField}`);
		}

		this.filters.push({
			field: sanitizedField,
			operator,
			value,
		});

		return this;
	}

	sort(field: string): this {
		if (!field || field.trim().length === 0) {
			throw new Error('Sort field is required');
		}

		const sanitizedField = field.replace(/[^a-zA-Z0-9_\-]/g, '');
		this.sortBy = sanitizedField;
		return this;
	}

	take(limit: number): this {
		if (!Number.isInteger(limit) || limit < this.MIN_LIMIT) {
			throw new Error(`Limit must be an integer >= ${this.MIN_LIMIT}`);
		}

		if (limit > this.MAX_LIMIT) {
			console.warn(`Limit capped to maximum: ${this.MAX_LIMIT}`);
			this.limit = this.MAX_LIMIT;
			return this;
		}

		this.limit = limit;
		return this;
	}

	skip(offset: number): this {
		if (!Number.isInteger(offset) || offset < this.MIN_OFFSET) {
			throw new Error(`Offset must be an integer >= ${this.MIN_OFFSET}`);
		}

		this.offset = offset;
		return this;
	}

	build(): QueryOptions {
		if (this.filters.length === 0) {
			console.warn('Building query with no filters');
		}

		return {
			filters: Object.freeze([...this.filters]),
			sortBy: this.sortBy,
			limit: this.limit,
			offset: this.offset,
		};
	}

	reset(): this {
		this.filters = [];
		this.sortBy = '';
		this.limit = 10;
		this.offset = 0;
		return this;
	}
}

// ============ STRATEGY PATTERN (With Validation) ============

interface PricingStrategy {
	calculate(basePrice: number): number;
	validate(): boolean;
}

class RegularPricing implements PricingStrategy {
	validate(): boolean {
		return true;
	}

	calculate(basePrice: number): number {
		if (typeof basePrice !== 'number' || basePrice < 0) {
			throw new Error('Base price must be a non-negative number');
		}
		return basePrice;
	}
}

class DiscountPricing implements PricingStrategy {
	private readonly MAX_DISCOUNT = 100;
	private readonly MIN_DISCOUNT = 0;

	constructor(private discountPercent: number) {
		if (!this.validate()) {
			throw new Error(
				`Discount percentage must be between ${this.MIN_DISCOUNT} and ${this.MAX_DISCOUNT}`,
			);
		}
	}

	validate(): boolean {
		return (
			Number.isInteger(this.discountPercent) &&
			this.discountPercent >= this.MIN_DISCOUNT &&
			this.discountPercent <= this.MAX_DISCOUNT
		);
	}

	calculate(basePrice: number): number {
		if (typeof basePrice !== 'number' || basePrice < 0) {
			throw new Error('Base price must be a non-negative number');
		}
		const discounted = basePrice * (1 - this.discountPercent / 100);
		return Math.max(0, discounted);
	}
}

class PremiumPricing implements PricingStrategy {
	private readonly MAX_PREMIUM = 200;
	private readonly MIN_PREMIUM = 0;

	constructor(private premiumPercent: number) {
		if (!this.validate()) {
			throw new Error(
				`Premium percentage must be between ${this.MIN_PREMIUM} and ${this.MAX_PREMIUM}`,
			);
		}
	}

	validate(): boolean {
		return (
			Number.isInteger(this.premiumPercent) &&
			this.premiumPercent >= this.MIN_PREMIUM &&
			this.premiumPercent <= this.MAX_PREMIUM
		);
	}

	calculate(basePrice: number): number {
		if (typeof basePrice !== 'number' || basePrice < 0) {
			throw new Error('Base price must be a non-negative number');
		}
		return basePrice * (1 + this.premiumPercent / 100);
	}
}

class OrderCalculator {
	constructor(private strategy: PricingStrategy) {
		if (!strategy) {
			throw new Error('Pricing strategy is required');
		}
	}

	setStrategy(strategy: PricingStrategy): void {
		if (!strategy) {
			throw new Error('Pricing strategy cannot be null or undefined');
		}
		if (!strategy.validate()) {
			throw new Error('Invalid pricing strategy');
		}
		this.strategy = strategy;
	}

	calculateTotal(items: Array<{ price: number; quantity: number }>): number {
		if (!Array.isArray(items) || items.length === 0) {
			throw new Error('Items array is required and must not be empty');
		}

		for (const item of items) {
			if (typeof item.price !== 'number' || item.price < 0) {
				throw new Error('Each item must have a non-negative price');
			}
			if (typeof item.quantity !== 'number' || item.quantity < 0) {
				throw new Error('Each item must have a non-negative quantity');
			}
		}

		const basePrice = items.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
		const total = this.strategy.calculate(basePrice);

		return Math.round(total * 100) / 100;
	}
}

// Usage with error handling
try {
	let calculator = new OrderCalculator(new RegularPricing());
	let total = calculator.calculateTotal([{ price: 100, quantity: 2 }]);
	console.log('Regular total:', total);

	calculator.setStrategy(new DiscountPricing(10));
	total = calculator.calculateTotal([{ price: 100, quantity: 2 }]);
	console.log('Discounted total:', total);
} catch (error) {
	console.error('Calculator error:', (error as Error).message);
}

// ============ DECORATOR PATTERN (With Validation) ============

interface DataProcessor {
	process(data: string): string;
}

class BasicProcessor implements DataProcessor {
	process(data: string): string {
		if (typeof data !== 'string') {
			throw new Error('Data must be a string');
		}
		return data;
	}
}

abstract class ProcessorDecorator implements DataProcessor {
	constructor(protected processor: DataProcessor) {
		if (!processor) {
			throw new Error('Processor cannot be null or undefined');
		}
	}

	abstract process(data: string): string;
}

class UpperCaseDecorator extends ProcessorDecorator {
	process(data: string): string {
		if (typeof data !== 'string') {
			throw new Error('Data must be a string');
		}
		const processed = this.processor.process(data);
		return processed.toUpperCase();
	}
}

class TrimDecorator extends ProcessorDecorator {
	process(data: string): string {
		if (typeof data !== 'string') {
			throw new Error('Data must be a string');
		}
		const processed = this.processor.process(data);
		return processed.trim();
	}
}

class LoggingDecorator extends ProcessorDecorator {
	process(data: string): string {
		if (typeof data !== 'string') {
			throw new Error('Data must be a string');
		}

		console.log(`[Decorator] Processing: "${data.substring(0, 50)}..."`);
		try {
			const result = this.processor.process(data);
			console.log(`[Decorator] Result: "${result.substring(0, 50)}..."`);
			return result;
		} catch (error) {
			console.error(`[Decorator] Error: ${(error as Error).message}`);
			throw error;
		}
	}
}

// Usage with error handling
try {
	let processor: DataProcessor = new BasicProcessor();
	processor = new TrimDecorator(processor);
	processor = new UpperCaseDecorator(processor);
	processor = new LoggingDecorator(processor);

	const result = processor.process('  hello world  ');
	console.log('Final result:', result);
} catch (error) {
	console.error('Decorator error:', (error as Error).message);
}

// ============ OBSERVER PATTERN (With Validation) ============

interface Observer {
	update(data: any): void;
	getId(): string;
}

class OrderEvent {
	private observers: Map<string, Observer> = new Map();
	private data: any;

	attach(observer: Observer): void {
		if (!observer || !observer.getId) {
			throw new Error('Observer must have getId method');
		}

		const id = observer.getId();
		if (this.observers.has(id)) {
			console.warn(`Observer ${id} is already attached`);
			return;
		}

		this.observers.set(id, observer);
		console.log(`Observer ${id} attached`);
	}

	detach(observerId: string): void {
		if (!observerId) {
			throw new Error('Observer ID is required');
		}

		if (!this.observers.has(observerId)) {
			console.warn(`Observer ${observerId} not found`);
			return;
		}

		this.observers.delete(observerId);
		console.log(`Observer ${observerId} detached`);
	}

	notify(data: any): void {
		if (!data || typeof data !== 'object') {
			throw new Error('Data must be an object');
		}

		this.data = data;
		let successCount = 0;

		for (const observer of this.observers.values()) {
			try {
				observer.update(data);
				successCount++;
			} catch (error) {
				console.error(`Observer update failed: ${(error as Error).message}`);
			}
		}

		console.log(`Notified ${successCount}/${this.observers.size} observers`);
	}

	getObserverCount(): number {
		return this.observers.size;
	}
}

class EmailNotificationObserver implements Observer {
	constructor(private id: string) {}

	getId(): string {
		return this.id;
	}

	update(data: any): void {
		if (!data.orderId) {
			throw new Error('Order ID is required');
		}
		console.log(`[EMAIL] Order ${data.orderId} was placed`);
	}
}

class LoggingObserver implements Observer {
	constructor(private id: string) {}

	getId(): string {
		return this.id;
	}

	update(data: any): void {
		console.log(`[LOG] ${JSON.stringify(data)}`);
	}
}

class AnalyticsObserver implements Observer {
	constructor(private id: string) {}

	getId(): string {
		return this.id;
	}

	update(data: any): void {
		if (!data.orderId) {
			throw new Error('Order ID is required');
		}
		console.log(`[ANALYTICS] Tracking order ${data.orderId}`);
	}
}

// Usage with error handling
try {
	const orderEvent = new OrderEvent();
	orderEvent.attach(new EmailNotificationObserver('email-observer'));
	orderEvent.attach(new LoggingObserver('log-observer'));
	orderEvent.attach(new AnalyticsObserver('analytics-observer'));

	orderEvent.notify({ orderId: '123', total: 99.99 });
} catch (error) {
	console.error('Observer error:', (error as Error).message);
}

// ============ STATE PATTERN (With Validation & Logging) ============

interface State {
	proceed(context: Order): void;
}

class PendingState implements State {
	proceed(context: Order): void {
		console.log('[State] Order is PENDING. Processing payment...');
		try {
			// TODO: Process payment
			context.setState(new ProcessingState());
		} catch (error) {
			console.error(
				'[State] Payment processing failed:',
				(error as Error).message,
			);
			throw error;
		}
	}
}

class ProcessingState implements State {
	proceed(context: Order): void {
		console.log('[State] Order is PROCESSING. Preparing shipment...');
		try {
			// TODO: Prepare shipment
			context.setState(new ShippedState());
		} catch (error) {
			console.error(
				'[State] Shipment preparation failed:',
				(error as Error).message,
			);
			throw error;
		}
	}
}

class ShippedState implements State {
	proceed(context: Order): void {
		console.log('[State] Order is SHIPPED. Waiting for delivery...');
		try {
			// TODO: Track shipment
			context.setState(new DeliveredState());
		} catch (error) {
			console.error('[State] Tracking failed:', (error as Error).message);
			throw error;
		}
	}
}

class DeliveredState implements State {
	proceed(context: Order): void {
		console.log('[State] Order DELIVERED. Complete!');
	}
}

class Order {
	private state: State;
	private readonly maxStateTransitions = 10;
	private transitionCount = 0;

	constructor() {
		this.state = new PendingState();
	}

	setState(state: State): void {
		if (!state) {
			throw new Error('State cannot be null or undefined');
		}

		this.transitionCount++;
		if (this.transitionCount > this.maxStateTransitions) {
			throw new Error('Maximum state transitions exceeded');
		}

		this.state = state;
	}

	proceed(): void {
		try {
			this.state.proceed(this);
		} catch (error) {
			console.error('[State] Transition failed:', (error as Error).message);
			throw error;
		}
	}

	getTransitionCount(): number {
		return this.transitionCount;
	}
}

// Usage with error handling
try {
	const order = new Order();
	order.proceed(); // Pending -> Processing
	order.proceed(); // Processing -> Shipped
	order.proceed(); // Shipped -> Delivered
	console.log(`Total transitions: ${order.getTransitionCount()}`);
} catch (error) {
	console.error('Order state error:', (error as Error).message);
}

// ============ ADAPTER PATTERN (With Validation & Error Handling) ============

interface OldPaymentGateway {
	pay(amount: number): boolean;
}

interface NewPaymentProcessor {
	processPayment(amount: number): Promise<boolean>;
}

class LegacyPaymentGateway implements OldPaymentGateway {
	pay(amount: number): boolean {
		if (amount <= 0) {
			throw new Error('Payment amount must be positive');
		}
		console.log(`[Legacy] Payment of ${amount} processed successfully`);
		return true;
	}
}

class PaymentAdapter implements NewPaymentProcessor {
	constructor(private legacyGateway: OldPaymentGateway) {
		if (!legacyGateway) {
			throw new Error('Legacy gateway is required');
		}
	}

	async processPayment(amount: number): Promise<boolean> {
		if (typeof amount !== 'number' || amount <= 0) {
			throw new Error('Amount must be a positive number');
		}

		try {
			console.log('[Adapter] Converting to legacy format...');
			const result = this.legacyGateway.pay(amount);

			if (!result) {
				throw new Error('Legacy gateway payment failed');
			}

			console.log('[Adapter] Payment processed successfully');
			return true;
		} catch (error) {
			console.error('[Adapter] Error:', (error as Error).message);
			throw error;
		}
	}
}

// Usage with error handling
async function adapterExample() {
	try {
		const legacyGateway = new LegacyPaymentGateway();
		const adapter = new PaymentAdapter(legacyGateway);
		await adapter.processPayment(100);
	} catch (error) {
		console.error('Adapter error:', (error as Error).message);
	}
}

// ============ PROXY PATTERN (With Caching, Validation & Error Handling) ============

interface Database {
	query(sql: string): Promise<any[]>;
}

class RealDatabase implements Database {
	async query(sql: string): Promise<any[]> {
		if (!sql || typeof sql !== 'string') {
			throw new Error('SQL query must be a non-empty string');
		}

		console.log(`[RealDB] Executing query: ${sql.substring(0, 50)}...`);

		// Simulate expensive database operation
		await new Promise((resolve) => setTimeout(resolve, 100));

		return [{ id: 1, data: 'sample' }];
	}
}

class DatabaseProxy implements Database {
	private realDatabase: RealDatabase | null = null;
	private cache: Map<string, any[]> = new Map();
	private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
	private cacheTimestamps: Map<string, number> = new Map();
	private queryCount = 0;
	private cacheHits = 0;

	async query(sql: string): Promise<any[]> {
		if (!sql || typeof sql !== 'string') {
			throw new Error('SQL query must be a non-empty string');
		}

		this.queryCount++;

		// Check cache
		if (this.cache.has(sql)) {
			const timestamp = this.cacheTimestamps.get(sql) || 0;
			if (Date.now() - timestamp < this.CACHE_TTL) {
				this.cacheHits++;
				console.log(
					`[Proxy] Cache hit for query: ${sql.substring(0, 50)}... (${this.cacheHits}/${this.queryCount})`,
				);
				return this.cache.get(sql) || [];
			}

			// Cache expired
			console.log(
				`[Proxy] Cache expired for query: ${sql.substring(0, 50)}...`,
			);
			this.cache.delete(sql);
			this.cacheTimestamps.delete(sql);
		}

		// Lazy load real database
		if (!this.realDatabase) {
			console.log('[Proxy] Lazy loading RealDatabase...');
			this.realDatabase = new RealDatabase();
		}

		try {
			console.log(`[Proxy] Executing query: ${sql.substring(0, 50)}...`);
			const result = await this.realDatabase.query(sql);

			// Cache result
			this.cache.set(sql, result);
			this.cacheTimestamps.set(sql, Date.now());

			return result;
		} catch (error) {
			console.error('[Proxy] Query failed:', (error as Error).message);
			throw new Error(`Database query failed: ${(error as Error).message}`);
		}
	}

	getCacheStats(): { queryCount: number; cacheHits: number; hitRate: string } {
		const hitRate =
			this.queryCount > 0
				? ((this.cacheHits / this.queryCount) * 100).toFixed(2)
				: '0.00';
		return {
			queryCount: this.queryCount,
			cacheHits: this.cacheHits,
			hitRate: `${hitRate}%`,
		};
	}

	clearCache(): void {
		this.cache.clear();
		this.cacheTimestamps.clear();
		console.log('[Proxy] Cache cleared');
	}
}

// Usage with error handling
async function proxyExample() {
	try {
		const dbProxy = new DatabaseProxy();
		await dbProxy.query('SELECT * FROM users'); // Executes
		await dbProxy.query('SELECT * FROM users'); // Cached
		await dbProxy.query('SELECT * FROM products'); // Executes

		const stats = dbProxy.getCacheStats();
		console.log('[Proxy] Cache stats:', stats);
	} catch (error) {
		console.error('Proxy error:', (error as Error).message);
	}
}

// ============ COMMAND PATTERN (With Undo/Redo & Error Handling) ============

interface Command {
	execute(): void;
	undo(): void;
	getDescription(): string;
}

class Light {
	private isOn = false;
	private brightness = 100;

	turnOn(): void {
		if (this.isOn) {
			throw new Error('Light is already on');
		}
		this.isOn = true;
		console.log('[Light] Turned ON');
	}

	turnOff(): void {
		if (!this.isOn) {
			throw new Error('Light is already off');
		}
		this.isOn = false;
		this.brightness = 0;
		console.log('[Light] Turned OFF');
	}

	setBrightness(level: number): void {
		if (level < 0 || level > 100) {
			throw new Error('Brightness must be between 0 and 100');
		}
		this.brightness = level;
		console.log(`[Light] Brightness set to ${level}%`);
	}

	getStatus(): { isOn: boolean; brightness: number } {
		return { isOn: this.isOn, brightness: this.brightness };
	}
}

class TurnOnCommand implements Command {
	private previousState: boolean;

	constructor(private light: Light) {
		if (!light) {
			throw new Error('Light is required');
		}
		this.previousState = light.getStatus().isOn;
	}

	execute(): void {
		try {
			this.light.turnOn();
		} catch (error) {
			console.error('[Command] Execute failed:', (error as Error).message);
			throw error;
		}
	}

	undo(): void {
		try {
			if (this.previousState) {
				this.light.turnOn();
			} else {
				this.light.turnOff();
			}
		} catch (error) {
			console.error('[Command] Undo failed:', (error as Error).message);
		}
	}

	getDescription(): string {
		return 'TurnOn Light';
	}
}

class SetBrightnessCommand implements Command {
	private previousBrightness: number;

	constructor(
		private light: Light,
		private level: number,
	) {
		if (!light) {
			throw new Error('Light is required');
		}
		if (level < 0 || level > 100) {
			throw new Error('Brightness must be between 0 and 100');
		}
		this.previousBrightness = light.getStatus().brightness;
	}

	execute(): void {
		try {
			this.light.setBrightness(this.level);
		} catch (error) {
			console.error('[Command] Execute failed:', (error as Error).message);
			throw error;
		}
	}

	undo(): void {
		try {
			this.light.setBrightness(this.previousBrightness);
		} catch (error) {
			console.error('[Command] Undo failed:', (error as Error).message);
		}
	}

	getDescription(): string {
		return `Set Brightness to ${this.level}%`;
	}
}

class CommandInvoker {
	private history: Command[] = [];
	private readonly MAX_HISTORY = 100;

	executeCommand(command: Command): void {
		if (!command) {
			throw new Error('Command cannot be null or undefined');
		}

		try {
			command.execute();
			this.history.push(command);

			// Limit history size
			if (this.history.length > this.MAX_HISTORY) {
				this.history.shift();
			}

			console.log(
				`[Invoker] Executed: ${command.getDescription()} (History: ${this.history.length})`,
			);
		} catch (error) {
			console.error(
				'[Invoker] Command execution failed:',
				(error as Error).message,
			);
			throw error;
		}
	}

	undo(): void {
		if (this.history.length === 0) {
			console.warn('[Invoker] No commands to undo');
			return;
		}

		const command = this.history.pop();
		if (command) {
			command.undo();
			console.log(`[Invoker] Undid: ${command.getDescription()}`);
		}
	}

	getHistorySize(): number {
		return this.history.length;
	}
}

// Usage with error handling
function commandExample() {
	try {
		const light = new Light();
		const invoker = new CommandInvoker();

		invoker.executeCommand(new TurnOnCommand(light));
		invoker.executeCommand(new SetBrightnessCommand(light, 75));
		invoker.executeCommand(new SetBrightnessCommand(light, 50));

		console.log(`[Command] History size: ${invoker.getHistorySize()}`);

		invoker.undo(); // Undo brightness 50
		invoker.undo(); // Undo brightness 75
		invoker.undo(); // Undo turn on

		console.log(
			`[Command] After undos - History size: ${invoker.getHistorySize()}`,
		);
	} catch (error) {
		console.error('Command pattern error:', (error as Error).message);
	}
}

// ============ EXPORTS ============

export {
	// Factory Pattern
	NotificationFactory,
	NotificationService,
	EmailNotification,
	SMSNotification,
	PushNotification,

	// Builder Pattern
	QueryBuilder,
	QueryFilter,
	QueryOptions,

	// Strategy Pattern
	PricingStrategy,
	RegularPricing,
	DiscountPricing,
	PremiumPricing,
	OrderCalculator,

	// Decorator Pattern
	DataProcessor,
	BasicProcessor,
	ProcessorDecorator,
	UpperCaseDecorator,
	TrimDecorator,
	LoggingDecorator,

	// Observer Pattern
	Observer,
	OrderEvent,
	EmailNotificationObserver,
	LoggingObserver,
	AnalyticsObserver,

	// State Pattern
	State,
	PendingState,
	ProcessingState,
	ShippedState,
	DeliveredState,
	Order,

	// Adapter Pattern
	OldPaymentGateway,
	NewPaymentProcessor,
	LegacyPaymentGateway,
	PaymentAdapter,

	// Proxy Pattern
	Database,
	RealDatabase,
	DatabaseProxy,

	// Command Pattern
	Command,
	Light,
	TurnOnCommand,
	SetBrightnessCommand,
	CommandInvoker,

	// Example functions
	notificationExample,
	adapterExample,
	proxyExample,
	commandExample,
};
