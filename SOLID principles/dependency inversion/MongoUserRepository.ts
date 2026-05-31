import { User, UserRepository } from './Abstractions';

/**
 * MongoDB Repository Implementation
 *
 * DIP: Implements UserRepository interface
 * Different implementation details, same interface
 * High-level code doesn't care about MongoDB-specific operations
 */

export class MongoUserRepository implements UserRepository {
	private documents: Map<string, User> = new Map(); // Simulated MongoDB collection

	async findById(id: string): Promise<User | null> {
		// Simulates: db.collection('users').findOne({ id })
		console.log(`  [MongoDB] Query: db.users.findOne({ id: "${id}" })`);
		return this.documents.get(id) || null;
	}

	async findAll(): Promise<User[]> {
		// Simulates: db.collection('users').find({}).toArray()
		console.log('  [MongoDB] Query: db.users.find({}).toArray()');
		return Array.from(this.documents.values());
	}

	async findByEmail(email: string): Promise<User | null> {
		// Simulates: db.collection('users').findOne({ email })
		console.log(`  [MongoDB] Query: db.users.findOne({ email: "${email}" })`);
		for (const doc of this.documents.values()) {
			if (doc.email === email) return doc;
		}
		return null;
	}

	async save(user: User): Promise<void> {
		// Simulates: db.collection('users').insertOne(user)
		console.log(
			`  [MongoDB] Operation: db.users.insertOne({ id: "${user.id}", name: "${user.name}" })`,
		);
		this.documents.set(user.id, user);
	}

	async update(id: string, updates: Partial<User>): Promise<void> {
		// Simulates: db.collection('users').updateOne({ id }, { $set: updates })
		console.log(`  [MongoDB] Operation: db.users.updateOne({ id: "${id}" }, { $set: {...} })`);
		const doc = this.documents.get(id);
		if (doc) {
			this.documents.set(id, { ...doc, ...updates });
		}
	}

	async delete(id: string): Promise<void> {
		// Simulates: db.collection('users').deleteOne({ id })
		console.log(`  [MongoDB] Operation: db.users.deleteOne({ id: "${id}" })`);
		this.documents.delete(id);
	}

	// Utility for testing
	getCollectionSize(): number {
		return this.documents.size;
	}
}
