// Express.js + TypeScript Service Layer Template
// Production-ready with comprehensive error handling, validation, and logging

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// ============ CONFIGURATION & CONSTANTS ============

const CONFIG = {
	PORT: process.env.PORT || 3000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
	MAX_REQUEST_SIZE: '10mb',
	REQUEST_TIMEOUT: 30000, // 30 seconds
};

const CONSTANTS = {
	ERROR_CODES: {
		VALIDATION_ERROR: 'VALIDATION_ERROR',
		NOT_FOUND: 'NOT_FOUND',
		CONFLICT: 'CONFLICT',
		INTERNAL_ERROR: 'INTERNAL_ERROR',
		UNAUTHORIZED: 'UNAUTHORIZED',
		DATABASE_ERROR: 'DATABASE_ERROR',
	},
};

// ============ LOGGING ============

interface Logger {
	info(message: string, meta?: any): void;
	error(message: string, error?: Error, meta?: any): void;
	warn(message: string, meta?: any): void;
	debug(message: string, meta?: any): void;
}

class ConsoleLogger implements Logger {
	private formatMessage(level: string, message: string, meta?: any): string {
		const timestamp = new Date().toISOString();
		const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
		return `[${timestamp}] [${level}] ${message}${metaStr}`;
	}

	info(message: string, meta?: any): void {
		console.log(this.formatMessage('INFO', message, meta));
	}

	error(message: string, error?: Error, meta?: any): void {
		const errorDetails = error ? `${error.message} | ${error.stack}` : '';
		console.error(
			this.formatMessage('ERROR', `${message} | ${errorDetails}`, meta),
		);
	}

	warn(message: string, meta?: any): void {
		console.warn(this.formatMessage('WARN', message, meta));
	}

	debug(message: string, meta?: any): void {
		if (CONFIG.LOG_LEVEL === 'debug') {
			console.log(this.formatMessage('DEBUG', message, meta));
		}
	}
}

const logger = new ConsoleLogger();

// ============ VALIDATORS ============

class ValidationService {
	static isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email) && email.length <= 255;
	}

	static isValidString(
		value: string,
		minLength: number = 1,
		maxLength: number = 255,
	): boolean {
		if (typeof value !== 'string') return false;
		return value.trim().length >= minLength && value.length <= maxLength;
	}

	static isValidId(id: string): boolean {
		if (typeof id !== 'string' || !id.trim()) return false;
		return id.length > 0 && id.length <= 36;
	}

	static sanitizeString(value: string): string {
		return value.trim().slice(0, 255);
	}
}

// ============ REQUEST CONTEXT ============

declare global {
	namespace Express {
		interface Request {
			requestId: string;
			startTime: number;
		}
	}
}

// ============ DATABASE LAYER (Repository Pattern) ============

interface IUserRepository {
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	save(user: User): Promise<User>;
	update(id: string, user: Partial<User>): Promise<User>;
	delete(id: string): Promise<void>;
}

class UserRepository implements IUserRepository {
	async findById(id: string): Promise<User | null> {
		try {
			if (!ValidationService.isValidId(id)) {
				logger.warn('Invalid ID format', { id });
				return null;
			}
			// TODO: Implement actual database query with connection pooling
			logger.debug('Querying user by ID', { id });
			return null;
		} catch (error) {
			logger.error('Failed to find user by ID', error as Error, { id });
			throw new DatabaseError('Failed to retrieve user');
		}
	}

	async findByEmail(email: string): Promise<User | null> {
		try {
			if (!ValidationService.isValidEmail(email)) {
				logger.warn('Invalid email format', { email });
				return null;
			}
			// TODO: Implement actual database query
			logger.debug('Querying user by email', { email });
			return null;
		} catch (error) {
			logger.error('Failed to find user by email', error as Error, { email });
			throw new DatabaseError('Failed to retrieve user');
		}
	}

	async save(user: User): Promise<User> {
		try {
			if (!user) {
				throw new ValidationError('User object is required');
			}
			// TODO: Implement actual database insert with transaction
			logger.debug('Saving user', { userId: user.id });
			return user;
		} catch (error) {
			logger.error('Failed to save user', error as Error, { userId: user?.id });
			throw new DatabaseError('Failed to save user');
		}
	}

	async update(id: string, userData: Partial<User>): Promise<User> {
		try {
			if (!ValidationService.isValidId(id)) {
				throw new ValidationError('Invalid user ID');
			}
			if (!userData || Object.keys(userData).length === 0) {
				throw new ValidationError('No data to update');
			}
			// TODO: Implement actual database update with optimistic locking
			logger.debug('Updating user', { id });
			return {} as User;
		} catch (error) {
			logger.error('Failed to update user', error as Error, { id });
			if (error instanceof AppError) throw error;
			throw new DatabaseError('Failed to update user');
		}
	}

	async delete(id: string): Promise<void> {
		try {
			if (!ValidationService.isValidId(id)) {
				throw new ValidationError('Invalid user ID');
			}
			// TODO: Implement actual database delete with soft delete consideration
			logger.debug('Deleting user', { id });
		} catch (error) {
			logger.error('Failed to delete user', error as Error, { id });
			if (error instanceof AppError) throw error;
			throw new DatabaseError('Failed to delete user');
		}
	}
}

// ============ DATABASE LAYER (Repository Pattern) ============

interface IUserRepository {
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	save(user: User): Promise<User>;
	update(id: string, user: Partial<User>): Promise<User>;
	delete(id: string): Promise<void>;
}

class UserRepository implements IUserRepository {
	async findById(id: string): Promise<User | null> {
		// Simulate database query
		return null;
	}

	async findByEmail(email: string): Promise<User | null> {
		return null;
	}

	async save(user: User): Promise<User> {
		// Insert into database
		return user;
	}

	async update(id: string, user: Partial<User>): Promise<User> {
		// Update database
		return {} as User;
	}

	async delete(id: string): Promise<void> {
		// Delete from database
	}
}

// ============ DOMAIN MODEL ============

class User {
	constructor(
		readonly id: string,
		readonly email: string,
		readonly name: string,
		readonly createdAt: Date,
	) {
		// Validate in constructor
		if (!ValidationService.isValidId(id)) {
			throw new ValidationError('Invalid user ID');
		}
		if (!ValidationService.isValidEmail(email)) {
			throw new ValidationError('Invalid email format');
		}
		if (!ValidationService.isValidString(name, 1, 100)) {
			throw new ValidationError('Invalid name format');
		}
	}

	static create(email: string, name: string): User {
		const sanitizedEmail = ValidationService.sanitizeString(email);
		const sanitizedName = ValidationService.sanitizeString(name);

		if (!ValidationService.isValidEmail(sanitizedEmail)) {
			throw new ValidationError('Invalid email format');
		}
		if (!ValidationService.isValidString(sanitizedName, 1, 100)) {
			throw new ValidationError('Invalid name (1-100 characters)');
		}

		const id = crypto.randomUUID();
		return new User(id, sanitizedEmail, sanitizedName, new Date());
	}
}

// ============ SERVICE LAYER (Business Logic) ============

interface IUserService {
	getUserById(id: string): Promise<User>;
	createUser(email: string, name: string): Promise<User>;
	updateUser(id: string, data: Partial<User>): Promise<User>;
	deleteUser(id: string): Promise<void>;
}

class UserService implements IUserService {
	constructor(private userRepository: IUserRepository) {
		if (!userRepository) {
			throw new Error('UserRepository is required');
		}
	}

	async getUserById(id: string): Promise<User> {
		try {
			if (!ValidationService.isValidId(id)) {
				throw new ValidationError('Invalid user ID format');
			}

			logger.debug('Fetching user by ID', { id });
			const user = await this.userRepository.findById(id);

			if (!user) {
				logger.warn('User not found', { id });
				throw new NotFoundError(`User with ID ${id} not found`);
			}

			return user;
		} catch (error) {
			if (error instanceof AppError) throw error;
			logger.error('Error fetching user', error as Error, { id });
			throw new InternalServerError('Failed to fetch user');
		}
	}

	async createUser(email: string, name: string): Promise<User> {
		try {
			// Validate inputs
			if (!email || !name) {
				throw new ValidationError('Email and name are required');
			}

			const sanitizedEmail = ValidationService.sanitizeString(email);
			const sanitizedName = ValidationService.sanitizeString(name);

			if (!ValidationService.isValidEmail(sanitizedEmail)) {
				throw new ValidationError('Invalid email format');
			}

			if (!ValidationService.isValidString(sanitizedName, 1, 100)) {
				throw new ValidationError('Name must be 1-100 characters');
			}

			logger.debug('Creating new user', { email: sanitizedEmail });

			// Check for duplicates
			const existingUser =
				await this.userRepository.findByEmail(sanitizedEmail);
			if (existingUser) {
				logger.warn('User creation failed: email already exists', {
					email: sanitizedEmail,
				});
				throw new ConflictError(
					`User with email ${sanitizedEmail} already exists`,
				);
			}

			// Create and save
			const user = User.create(sanitizedEmail, sanitizedName);
			const savedUser = await this.userRepository.save(user);

			logger.info('User created successfully', {
				userId: savedUser.id,
				email: sanitizedEmail,
			});
			return savedUser;
		} catch (error) {
			if (error instanceof AppError) throw error;
			logger.error('Error creating user', error as Error, { email });
			throw new InternalServerError('Failed to create user');
		}
	}

	async updateUser(id: string, data: Partial<User>): Promise<User> {
		try {
			if (!ValidationService.isValidId(id)) {
				throw new ValidationError('Invalid user ID format');
			}

			if (!data || Object.keys(data).length === 0) {
				throw new ValidationError('No update data provided');
			}

			logger.debug('Updating user', { id });

			// Verify user exists
			await this.getUserById(id);

			// Validate update fields
			if (data.email && !ValidationService.isValidEmail(data.email)) {
				throw new ValidationError('Invalid email format');
			}

			if (data.name && !ValidationService.isValidString(data.name, 1, 100)) {
				throw new ValidationError('Name must be 1-100 characters');
			}

			const updatedUser = await this.userRepository.update(id, data);

			logger.info('User updated successfully', { userId: id });
			return updatedUser;
		} catch (error) {
			if (error instanceof AppError) throw error;
			logger.error('Error updating user', error as Error, { id });
			throw new InternalServerError('Failed to update user');
		}
	}

	async deleteUser(id: string): Promise<void> {
		try {
			if (!ValidationService.isValidId(id)) {
				throw new ValidationError('Invalid user ID format');
			}

			logger.debug('Deleting user', { id });

			// Verify user exists before deletion
			await this.getUserById(id);

			await this.userRepository.delete(id);

			logger.info('User deleted successfully', { userId: id });
		} catch (error) {
			if (error instanceof AppError) throw error;
			logger.error('Error deleting user', error as Error, { id });
			throw new InternalServerError('Failed to delete user');
		}
	}
}

// ============ DEPENDENCY INJECTION ============

type ServiceFactory<T> = () => T;

class DIContainer {
	private services = new Map<string, any>();
	private factories = new Map<string, ServiceFactory<any>>();
	private singletons = new Map<string, boolean>();

	register<T>(name: string, service: T, isSingleton: boolean = true): void {
		if (!name || typeof name !== 'string') {
			throw new Error('Service name must be a non-empty string');
		}
		if (service === null || service === undefined) {
			throw new Error(`Service "${name}" cannot be null or undefined`);
		}
		if (this.services.has(name)) {
			logger.warn(`Service "${name}" is being overwritten`);
		}
		this.services.set(name, service);
		this.singletons.set(name, isSingleton);
	}

	registerFactory<T>(
		name: string,
		factory: ServiceFactory<T>,
		isSingleton: boolean = true,
	): void {
		if (!name || typeof name !== 'string') {
			throw new Error('Service name must be a non-empty string');
		}
		if (typeof factory !== 'function') {
			throw new Error(`Factory for "${name}" must be a function`);
		}
		this.factories.set(name, factory);
		this.singletons.set(name, isSingleton);
	}

	get<T>(name: string): T {
		if (!name || typeof name !== 'string') {
			throw new Error('Service name must be a non-empty string');
		}

		// Check if service is already registered
		if (this.services.has(name)) {
			return this.services.get(name) as T;
		}

		// Check if factory is registered
		if (this.factories.has(name)) {
			const factory = this.factories.get(name)!;
			const instance = factory();

			if (this.singletons.get(name)) {
				this.services.set(name, instance);
			}

			return instance as T;
		}

		throw new Error(
			`Service "${name}" not found in DI container. Available services: ${Array.from(this.services.keys()).join(', ')}`,
		);
	}

	has(name: string): boolean {
		return this.services.has(name) || this.factories.has(name);
	}
}

// ============ DTOs (Data Transfer Objects) ============

interface CreateUserDTO {
	email: string;
	name: string;
}

interface UpdateUserDTO {
	email?: string;
	name?: string;
}

interface UserResponseDTO {
	id: string;
	email: string;
	name: string;
	createdAt: string;
}

interface ErrorResponseDTO {
	error: string;
	code: string;
	statusCode: number;
	timestamp: string;
	requestId?: string;
	details?: any;
}

// ============ ERROR HANDLING ============

abstract class AppError extends Error {
	abstract readonly statusCode: number;
	abstract readonly code: string;

	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace(this, this.constructor);
	}
}

class ValidationError extends AppError {
	readonly statusCode = 400;
	readonly code = CONSTANTS.ERROR_CODES.VALIDATION_ERROR;

	constructor(message: string) {
		super(message);
	}
}

class NotFoundError extends AppError {
	readonly statusCode = 404;
	readonly code = CONSTANTS.ERROR_CODES.NOT_FOUND;

	constructor(message: string = 'Resource not found') {
		super(message);
	}
}

class ConflictError extends AppError {
	readonly statusCode = 409;
	readonly code = CONSTANTS.ERROR_CODES.CONFLICT;

	constructor(message: string = 'Resource already exists') {
		super(message);
	}
}

class UnauthorizedError extends AppError {
	readonly statusCode = 401;
	readonly code = CONSTANTS.ERROR_CODES.UNAUTHORIZED;

	constructor(message: string = 'Unauthorized') {
		super(message);
	}
}

class DatabaseError extends AppError {
	readonly statusCode = 500;
	readonly code = CONSTANTS.ERROR_CODES.DATABASE_ERROR;

	constructor(message: string = 'Database operation failed') {
		super(message);
	}
}

class InternalServerError extends AppError {
	readonly statusCode = 500;
	readonly code = CONSTANTS.ERROR_CODES.INTERNAL_ERROR;

	constructor(message: string = 'Internal server error') {
		super(message);
	}
}

// ============ MIDDLEWARE ============

// Request ID middleware - for tracking and debugging
const requestIdMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	req.requestId =
		(req.headers['x-request-id'] as string) || crypto.randomUUID();
	req.startTime = Date.now();
	res.setHeader('X-Request-ID', req.requestId);
	next();
};

// Request logging middleware
const requestLoggingMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const originalSend = res.send;

	res.send = function (data: any) {
		const duration = Date.now() - req.startTime;
		logger.info('Request completed', {
			requestId: req.requestId,
			method: req.method,
			path: req.path,
			statusCode: res.statusCode,
			duration: `${duration}ms`,
		});
		return originalSend.call(this, data);
	};

	next();
};

// Global error handler
const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const requestId = req.requestId || 'unknown';

	// Handle AppError instances
	if (err instanceof AppError) {
		const response: ErrorResponseDTO = {
			error: err.message,
			code: err.code,
			statusCode: err.statusCode,
			timestamp: new Date().toISOString(),
			requestId,
		};

		logger.warn('Application error', {
			requestId,
			code: err.code,
			statusCode: err.statusCode,
			message: err.message,
		});

		res.status(err.statusCode).json(response);
		return;
	}

	// Handle generic errors
	const response: ErrorResponseDTO = {
		error:
			CONFIG.NODE_ENV === 'production' ? 'Internal server error' : err.message,
		code: CONSTANTS.ERROR_CODES.INTERNAL_ERROR,
		statusCode: 500,
		timestamp: new Date().toISOString(),
		requestId,
	};

	logger.error('Unhandled error', err, {
		requestId,
		path: req.path,
		method: req.method,
	});

	res.status(500).json(response);
};

// Request validation middleware
const validateJsonPayload = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	try {
		if (req.body && typeof req.body !== 'object') {
			throw new ValidationError('Request body must be valid JSON');
		}
		next();
	} catch (error) {
		next(new ValidationError('Invalid request format'));
	}
};

// Async handler wrapper for cleaner error handling
const asyncHandler =
	(fn: Function) => (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};

// Request timeout middleware
const timeoutMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	req.setTimeout(CONFIG.REQUEST_TIMEOUT);
	res.setTimeout(CONFIG.REQUEST_TIMEOUT, () => {
		logger.warn('Request timeout', {
			requestId: req.requestId,
			path: req.path,
		});
		res.status(408).json({
			error: 'Request timeout',
			code: 'REQUEST_TIMEOUT',
			statusCode: 408,
			timestamp: new Date().toISOString(),
			requestId: req.requestId,
		});
	});
	next();
};

// ============ CONTROLLERS ============

class UserController {
	constructor(private userService: IUserService) {
		if (!userService) {
			throw new Error('UserService is required');
		}
	}

	getUserById = asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;

		// Validate path parameter
		if (!id) {
			throw new ValidationError('User ID is required');
		}

		if (!ValidationService.isValidId(id)) {
			throw new ValidationError('Invalid user ID format');
		}

		logger.debug('GET /api/users/:id', { requestId: req.requestId, id });

		const user = await this.userService.getUserById(id);

		const response: UserResponseDTO = {
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt.toISOString(),
		};

		res.json(response);
	});

	createUser = asyncHandler(async (req: Request, res: Response) => {
		const { email, name }: CreateUserDTO = req.body;

		// Validate request body
		if (!email || !name) {
			throw new ValidationError('Email and name are required');
		}

		if (typeof email !== 'string' || typeof name !== 'string') {
			throw new ValidationError('Email and name must be strings');
		}

		const sanitizedEmail = ValidationService.sanitizeString(email);
		const sanitizedName = ValidationService.sanitizeString(name);

		if (!ValidationService.isValidEmail(sanitizedEmail)) {
			throw new ValidationError('Invalid email format');
		}

		if (!ValidationService.isValidString(sanitizedName, 1, 100)) {
			throw new ValidationError('Name must be 1-100 characters');
		}

		logger.debug('POST /api/users', {
			requestId: req.requestId,
			email: sanitizedEmail,
		});

		const user = await this.userService.createUser(
			sanitizedEmail,
			sanitizedName,
		);

		const response: UserResponseDTO = {
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt.toISOString(),
		};

		res.status(201).json(response);
	});

	updateUser = asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const data: UpdateUserDTO = req.body;

		// Validate path parameter
		if (!id || !ValidationService.isValidId(id)) {
			throw new ValidationError('Invalid user ID');
		}

		// Validate request body
		if (!data || Object.keys(data).length === 0) {
			throw new ValidationError('No data provided for update');
		}

		// Validate update fields
		if (data.email && !ValidationService.isValidEmail(data.email)) {
			throw new ValidationError('Invalid email format');
		}

		if (data.name && !ValidationService.isValidString(data.name, 1, 100)) {
			throw new ValidationError('Name must be 1-100 characters');
		}

		logger.debug('PUT /api/users/:id', { requestId: req.requestId, id });

		const user = await this.userService.updateUser(id, data);

		const response: UserResponseDTO = {
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt.toISOString(),
		};

		res.json(response);
	});

	deleteUser = asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;

		// Validate path parameter
		if (!id || !ValidationService.isValidId(id)) {
			throw new ValidationError('Invalid user ID');
		}

		logger.debug('DELETE /api/users/:id', { requestId: req.requestId, id });

		await this.userService.deleteUser(id);

		res.status(204).send();
	});

	// Health check endpoint
	health = asyncHandler(async (req: Request, res: Response) => {
		res.json({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			environment: CONFIG.NODE_ENV,
		});
	});
}

// ============ ROUTES ============

function createUserRoutes(controller: UserController): express.Router {
	const router = express.Router();

	router.get('/:id', controller.getUserById);
	router.post('/', controller.createUser);
	router.put('/:id', controller.updateUser);
	router.delete('/:id', controller.deleteUser);

	return router;
}

function createHealthRoutes(): express.Router {
	const router = express.Router();

	router.get('/', (req: Request, res: Response) => {
		res.json({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
		});
	});

	return router;
}

// ============ APPLICATION SETUP ============

export function createApp(): express.Application {
	const app = express();

	// ===== Global Middleware =====
	app.use(express.json({ limit: CONFIG.MAX_REQUEST_SIZE }));
	app.use(requestIdMiddleware);
	app.use(timeoutMiddleware);
	app.use(validateJsonPayload);
	app.use(requestLoggingMiddleware);

	// ===== Setup DI Container =====
	const container = new DIContainer();

	try {
		// Register repositories
		container.register<IUserRepository>(
			'userRepository',
			new UserRepository(),
			true, // singleton
		);

		// Register services
		container.registerFactory<IUserService>(
			'userService',
			() => new UserService(container.get('userRepository')),
			true, // singleton
		);

		logger.info('DI Container initialized successfully');
	} catch (error) {
		logger.error('Failed to initialize DI Container', error as Error);
		throw error;
	}

	// ===== Setup Controllers =====
	let userController: UserController;
	try {
		const userService = container.get<IUserService>('userService');
		userController = new UserController(userService);
		logger.info('UserController initialized successfully');
	} catch (error) {
		logger.error('Failed to initialize UserController', error as Error);
		throw error;
	}

	// ===== Routes =====
	app.use('/api/health', createHealthRoutes());
	app.use('/api/users', createUserRoutes(userController));

	// 404 handler
	app.use((req: Request, res: Response) => {
		res.status(404).json({
			error: `Route ${req.path} not found`,
			code: 'NOT_FOUND',
			statusCode: 404,
			timestamp: new Date().toISOString(),
			requestId: req.requestId,
		});
	});

	// Error handling middleware (must be last)
	app.use(errorHandler);

	return app;
}

// ============ SERVER STARTUP ============

async function startServer(): Promise<void> {
	try {
		const app = createApp();
		const PORT = Number(CONFIG.PORT) || 3000;

		const server = app.listen(PORT, () => {
			logger.info(`Server started successfully`, {
				port: PORT,
				environment: CONFIG.NODE_ENV,
				nodeVersion: process.version,
			});
		});

		// Graceful shutdown
		process.on('SIGTERM', () => {
			logger.info('SIGTERM received, shutting down gracefully');
			server.close(() => {
				logger.info('Server closed');
				process.exit(0);
			});
		});

		process.on('SIGINT', () => {
			logger.info('SIGINT received, shutting down gracefully');
			server.close(() => {
				logger.info('Server closed');
				process.exit(0);
			});
		});

		// Handle uncaught exceptions
		process.on('uncaughtException', (error: Error) => {
			logger.error('Uncaught exception', error);
			process.exit(1);
		});

		// Handle unhandled rejections
		process.on('unhandledRejection', (reason: any) => {
			logger.error('Unhandled rejection', new Error(String(reason)));
			process.exit(1);
		});
	} catch (error) {
		logger.error('Failed to start server', error as Error);
		process.exit(1);
	}
}

// Start server if this is the main module
if (require.main === module) {
	startServer();
}

export { UserService, UserController, DIContainer, logger };
