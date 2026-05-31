import { User, UserRepository } from './Abstractions';

/**
 * MySQL Repository Implementation
 *
 * DIP: Implements UserRepository interface
 * High-level code doesn't know about MySQL-specific details
 */

export class MySQLUserRepository implements UserRepository {
	private users: Map<string, User> = new Map(); // Simulated MySQL storage

	async findById(id: string): Promise<User | null> {
		// Simulates: SELECT * FROM users WHERE id = ?
		console.log(`  [MySQL] Querying: SELECT FROM users WHERE id = ${id}`);
		return this.users.get(id) || null;
	}

	async findAll(): Promise<User[]> {
		// Simulates: SELECT * FROM users
		console.log('  [MySQL] Querying: SELECT FROM users');
		return Array.from(this.users.values());
	}

	async findByEmail(email: string): Promise<User | null> {
		// Simulates: SELECT * FROM users WHERE email = ?
		console.log(`  [MySQL] Querying: SELECT FROM users WHERE email = ${email}`);
		for (const user of this.users.values()) {
			if (user.email === email) return user;
		}
		return null;
	}

	async save(user: User): Promise<void> {
		// Simulates: INSERT INTO users (id, name, email, age, createdAt) VALUES (?, ?, ?, ?, ?)
		console.log(
			`  [MySQL] Executing: INSERT INTO users (id=${user.id}, name=${user.name}, email=${user.email})`,
		);
		this.users.set(user.id, user);
	}

	async update(id: string, updates: Partial<User>): Promise<void> {
		// Simulates: UPDATE users SET ... WHERE id = ?
		console.log(`  [MySQL] Executing: UPDATE users SET ... WHERE id = ${id}`);
		const user = this.users.get(id);
		if (user) {
			this.users.set(id, { ...user, ...updates });
		}
	}

	async delete(id: string): Promise<void> {
		// Simulates: DELETE FROM users WHERE id = ?
		console.log(`  [MySQL] Executing: DELETE FROM users WHERE id = ${id}`);
		this.users.delete(id);
	}

	// Utility for testing
	getStorageSize(): number {
		return this.users.size;
	}
}
