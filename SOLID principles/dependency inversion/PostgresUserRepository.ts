import { User, UserRepository } from './Abstractions';

/**
 * PostgreSQL Repository Implementation
 *
 * DIP: Implements UserRepository interface
 * PostgreSQL-specific implementation details hidden from high-level code
 */

export class PostgresUserRepository implements UserRepository {
	private rows: Map<string, User> = new Map(); // Simulated PostgreSQL table

	async findById(id: string): Promise<User | null> {
		// Simulates: SELECT * FROM users WHERE id = $1
		console.log(
			`  [PostgreSQL] Query: SELECT * FROM users WHERE id = $1 [${id}]`,
		);
		return this.rows.get(id) || null;
	}

	async findAll(): Promise<User[]> {
		// Simulates: SELECT * FROM users
		console.log('  [PostgreSQL] Query: SELECT * FROM users');
		return Array.from(this.rows.values());
	}

	async findByEmail(email: string): Promise<User | null> {
		// Simulates: SELECT * FROM users WHERE email = $1
		console.log(
			`  [PostgreSQL] Query: SELECT * FROM users WHERE email = $1 [${email}]`,
		);
		for (const row of this.rows.values()) {
			if (row.email === email) return row;
		}
		return null;
	}

	async save(user: User): Promise<void> {
		// Simulates: INSERT INTO users (id, name, email, age, createdAt) VALUES ($1, $2, $3, $4, $5)
		console.log(
			`  [PostgreSQL] Execute: INSERT INTO users (id, name, email, age, createdAt) VALUES (...)`,
		);
		this.rows.set(user.id, user);
	}

	async update(id: string, updates: Partial<User>): Promise<void> {
		// Simulates: UPDATE users SET ... WHERE id = $1
		console.log(
			`  [PostgreSQL] Execute: UPDATE users SET ... WHERE id = $1 [${id}]`,
		);
		const row = this.rows.get(id);
		if (row) {
			this.rows.set(id, { ...row, ...updates });
		}
	}

	async delete(id: string): Promise<void> {
		// Simulates: DELETE FROM users WHERE id = $1
		console.log(
			`  [PostgreSQL] Execute: DELETE FROM users WHERE id = $1 [${id}]`,
		);
		this.rows.delete(id);
	}

	// Utility for testing
	getRowCount(): number {
		return this.rows.size;
	}
}
