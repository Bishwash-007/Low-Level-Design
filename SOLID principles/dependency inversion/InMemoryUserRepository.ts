import { User, UserRepository } from './Abstractions';

/**
 * In-Memory Repository Implementation
 *
 * DIP: Implements UserRepository interface
 * Perfect for testing, caching, or temporary data storage
 * High-level code treats it the same as MySQL, MongoDB, PostgreSQL
 */

export class InMemoryUserRepository implements UserRepository {
	private database: Map<string, User> = new Map();

	async findById(id: string): Promise<User | null> {
		console.log(`  [InMemory] Looking up user with id: ${id}`);
		return this.database.get(id) || null;
	}

	async findAll(): Promise<User[]> {
		console.log('  [InMemory] Retrieving all users');
		return Array.from(this.database.values());
	}

	async findByEmail(email: string): Promise<User | null> {
		console.log(`  [InMemory] Looking up user with email: ${email}`);
		for (const user of this.database.values()) {
			if (user.email === email) return user;
		}
		return null;
	}

	async save(user: User): Promise<void> {
		console.log(`  [InMemory] Saving user: ${user.id} (${user.name})`);
		this.database.set(user.id, user);
	}

	async update(id: string, updates: Partial<User>): Promise<void> {
		console.log(`  [InMemory] Updating user: ${id}`);
		const user = this.database.get(id);
		if (user) {
			this.database.set(id, { ...user, ...updates });
		}
	}

	async delete(id: string): Promise<void> {
		console.log(`  [InMemory] Deleting user: ${id}`);
		this.database.delete(id);
	}

	// Utilities for testing
	getAllUsers(): User[] {
		return Array.from(this.database.values());
	}

	clear(): void {
		this.database.clear();
	}

	size(): number {
		return this.database.size;
	}
}
