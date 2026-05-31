/**
 * DEPENDENCY INVERSION PRINCIPLE - Complete Example
 *
 * Demonstrates DIP with multi-database repository pattern:
 * - High-level code (UserService) depends on abstractions
 * - Low-level code (repositories) depends on abstractions
 * - Easy to swap implementations
 * - Perfect for testing
 */

import { UserService } from './UserService';
import { RepositoryFactory, DatabaseType } from './RepositoryFactory';
import { DIContainer } from './DIContainer';
import { InMemoryUserRepository } from './InMemoryUserRepository';

async function main() {
	console.log('\n');
	console.log('   DEPENDENCY INVERSION PRINCIPLE');
	console.log('   Multi-Database Repository Pattern');
	console.log('');

	//  DEMONSTRATION 1: Simple Factory Pattern
	console.log('\n 1 FACTORY PATTERN - Create Repository by Type\n');

	const mysqlRepo = RepositoryFactory.createRepository(DatabaseType.MySQL);
	const mongoRepo = RepositoryFactory.createRepository(DatabaseType.MongoDB);
	const postgresRepo = RepositoryFactory.createRepository(
		DatabaseType.PostgreSQL,
	);

	//  DEMONSTRATION 2: Same Service, Different Databases
	console.log('\n 2  SAME SERVICE CODE - Different Database Implementations\n');

	console.log('--- MySQL Service ---');
	const mysqlService = new UserService(mysqlRepo);
	await mysqlService.createUser('Alice', 'alice@example.com', 30);
	await mysqlService.createUser('Bob', 'bob@example.com', 25);

	console.log('\n--- MongoDB Service ---');
	const mongoService = new UserService(mongoRepo);
	await mongoService.createUser('Charlie', 'charlie@example.com', 35);
	await mongoService.createUser('Diana', 'diana@example.com', 28);

	console.log('\n--- PostgreSQL Service ---');
	const postgresService = new UserService(postgresRepo);
	await postgresService.createUser('Eve', 'eve@example.com', 32);
	await postgresService.createUser('Frank', 'frank@example.com', 27);

	console.log('\n Same UserService works with ALL databases!');

	//  DEMONSTRATION 3: Querying Different Databases
	console.log('\n 3  QUERYING FROM DIFFERENT DATABASES\n');

	console.log('--- MySQL ---');
	let users = await mysqlService.getAllUsers();
	console.log(`Total users in MySQL: ${users.length}`);

	console.log('\n--- MongoDB ---');
	users = await mongoService.getAllUsers();
	console.log(`Total users in MongoDB: ${users.length}`);

	console.log('\n--- PostgreSQL ---');
	users = await postgresService.getAllUsers();
	console.log(`Total users in PostgreSQL: ${users.length}`);

	//  DEMONSTRATION 4: Dependency Injection Container
	console.log('\n 4  DEPENDENCY INJECTION CONTAINER\n');

	const container = new DIContainer();

	console.log('--- Registering repositories ---');
	container.createAndRegisterRepository('primary-db', DatabaseType.MySQL);
	container.createAndRegisterRepository('cache-db', DatabaseType.InMemory);
	container.createAndRegisterRepository('backup-db', DatabaseType.MongoDB);

	console.log('\n--- Creating services ---');
	const primaryService = container.createService(
		'primary-service',
		'primary-db',
	);
	const cacheService = container.createService('cache-service', 'cache-db');

	console.log('\n--- Using services from container ---');
	await primaryService.createUser('Grace', 'grace@example.com', 29);
	await cacheService.createUser('Henry', 'henry@example.com', 31);

	//  DEMONSTRATION 5: Testing with Mock Repository
	console.log('\n 5  TESTING - In-Memory Repository (No Real Database)\n');

	const testRepo = new InMemoryUserRepository();
	const testService = new UserService(testRepo);

	console.log('--- Test Scenario 1: Create and Retrieve ---');
	await testService.createUser('Test User', 'test@example.com', 25);
	const user = await testService.getUserByEmail('test@example.com');
	console.log(` Retrieved user: ${user?.name} (${user?.email})`);

	console.log('\n--- Test Scenario 2: Update User ---');
	if (user) {
		await testService.updateUser(user.id, { age: 26 });
		const updated = await testService.getUserById(user.id);
		console.log(` Updated age: ${updated?.age}`);
	}

	console.log('\n--- Test Scenario 3: Delete User ---');
	if (user) {
		await testService.deleteUser(user.id);
		const deleted = await testService.getUserById(user.id);
		console.log(` User deleted: ${deleted === null}`);
	}

	//  DEMONSTRATION 6: Configuration-Driven Behavior
	console.log('\n 6  CONFIGURATION-DRIVEN - Choose Database at Runtime\n');

	const dbType = process.env.DATABASE_TYPE || 'inmemory';
	console.log(`Loading configuration: DATABASE_TYPE=${dbType}`);

	const configuredRepo = RepositoryFactory.createRepository(
		dbType as DatabaseType,
	);
	const configuredService = new UserService(configuredRepo);

	console.log('--- Using configured database ---');
	await configuredService.createUser('Config User', 'config@example.com', 30);
	const allUsers = await configuredService.getAllUsers();
	console.log(` Retrieved ${allUsers.length} user(s) from ${dbType}`);

	//  DEMONSTRATION 7: DIP Benefits
	console.log('\n 7  DIP BENEFITS DEMONSTRATED\n');

	console.log(' Abstraction-Based Design');
	console.log('  UserService depends on UserRepository interface');
	console.log('  Not on MySQL, MongoDB, or PostgreSQL specific code');

	console.log('\n Easy to Switch Implementations');
	console.log('  From: const service = new UserService(new MySQLRepo())');
	console.log('  To:   const service = new UserService(new MongoRepo())');
	console.log('  No changes to UserService code!');

	console.log('\n Testability');
	console.log('  Use InMemoryUserRepository in tests');
	console.log('  No database setup needed');
	console.log('  Fast, isolated tests');

	console.log('\n Configuration-Driven');
	console.log('  Read DB type from environment');
	console.log('  Create appropriate repository');
	console.log('  Application adapts at runtime');

	console.log('\n Extensibility');
	console.log('  Add new database: RedisUserRepository');
	console.log('  Add to factory');
	console.log('  Works immediately with UserService');

	//  DEMONSTRATION 8: Comparison
	console.log('\n 8 WITHOUT DIP vs WITH DIP\n');

	console.log(' WITHOUT DIP (Tightly Coupled):');
	console.log('   export class UserService {');
	console.log('     private db = new MySQLDatabase(); // Hard dependency!');
	console.log('     getUser(id) { return this.db.query(...); }');
	console.log('   }');
	console.log(
		"   Problem: Can't switch to MongoDB without modifying UserService",
	);

	console.log('\n WITH DIP (Loosely Coupled):');
	console.log('   export class UserService {');
	console.log('     constructor(private repo: UserRepository) {}');
	console.log(
		'     async getUser(id) { return await this.repo.findById(id); }',
	);
	console.log('   }');
	console.log('   Benefit: Works with ANY UserRepository implementation!');

	console.log('\n');
	console.log('   DIP: Depend on abstractions, not concretions!');
	console.log('\n');
}

main().catch(console.error);
