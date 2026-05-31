import { UserRepository } from './Abstractions';
import { MySQLUserRepository } from './MySQLUserRepository';
import { MongoUserRepository } from './MongoUserRepository';
import { PostgresUserRepository } from './PostgresUserRepository';
import { InMemoryUserRepository } from './InMemoryUserRepository';

/**
 * Database types enumeration
 */
export enum DatabaseType {
	MySQL = 'mysql',
	MongoDB = 'mongodb',
	PostgreSQL = 'postgres',
	InMemory = 'inmemory',
}

/**
 * Repository Factory
 *
 * DIP Application: Factory handles concrete implementation creation
 * High-level code doesn't know about concrete classes
 * Factory is the only place that directly uses concrete implementations
 */

export class RepositoryFactory {
	/**
	 * Create appropriate repository based on database type
	 *
	 * Usage:
	 *   const repo = RepositoryFactory.createRepository(DatabaseType.MySQL, connectionString);
	 *   const service = new UserService(repo);
	 */
	static createRepository(
		databaseType: DatabaseType | string,
		connectionString?: string,
	): UserRepository {
		switch (databaseType.toLowerCase()) {
			case DatabaseType.MySQL:
				console.log(' Factory: Creating MySQL Repository');
				return new MySQLUserRepository();

			case DatabaseType.MongoDB:
				console.log(' Factory: Creating MongoDB Repository');
				return new MongoUserRepository();

			case DatabaseType.PostgreSQL:
				console.log(' Factory: Creating PostgreSQL Repository');
				return new PostgresUserRepository();

			case DatabaseType.InMemory:
				console.log(' Factory: Creating In-Memory Repository');
				return new InMemoryUserRepository();

			default:
				throw new Error(`Unknown database type: ${databaseType}`);
		}
	}

	/**
	 * Get all available database types
	 */
	static getAvailableDatabases(): string[] {
		return Object.values(DatabaseType);
	}
}
