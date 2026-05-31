/**
 * DEPENDENCY INVERSION PRINCIPLE
 *
 * Core abstractions that both high-level and low-level modules depend on
 * High-level code (UserService) depends on UserRepository
 * Low-level code (Database implementations) implements UserRepository
 */

// Domain Model
export interface User {
	id: string;
	name: string;
	email: string;
	age: number;
	createdAt: Date;
}

/**
 * Abstraction: UserRepository Interface
 * Neither high-level nor low-level code depends on concrete implementations
 * Both depend on this abstraction
 */
export interface UserRepository {
	findById(id: string): Promise<User | null>;
	findAll(): Promise<User[]>;
	findByEmail(email: string): Promise<User | null>;
	save(user: User): Promise<void>;
	update(id: string, user: Partial<User>): Promise<void>;
	delete(id: string): Promise<void>;
}

/**
 * Database connection interface for low-level modules
 */
export interface DatabaseConnection {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	isConnected(): boolean;
}
