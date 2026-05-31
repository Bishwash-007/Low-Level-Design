import { User, UserRepository } from './Abstractions';

/**
 * Helper function to generate unique IDs
 */
function generateUUID(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * UserService - High-Level Module
 *
 * DIP KEY PRINCIPLE: This depends on UserRepository abstraction
 * NOT on concrete implementations (MySQL, MongoDB, PostgreSQL)
 *
 * UserService doesn't care:
 * - Which database is used
 * - How queries are formatted
 * - Connection details
 * - Query optimization
 *
 * It only cares about the UserRepository contract
 */

export class UserService {
	/**
	 * Dependency Injection: Repository passed via constructor
	 * Could be MySQL, MongoDB, PostgreSQL, or InMemory
	 */
	constructor(private userRepository: UserRepository) {}

	async getUserById(id: string): Promise<User | null> {
		console.log(`\n UserService.getUserById(${id})`);
		return await this.userRepository.findById(id);
	}

	async getAllUsers(): Promise<User[]> {
		console.log('\n UserService.getAllUsers()');
		return await this.userRepository.findAll();
	}

	async getUserByEmail(email: string): Promise<User | null> {
		console.log(`\n UserService.getUserByEmail(${email})`);
		return await this.userRepository.findByEmail(email);
	}

	async createUser(name: string, email: string, age: number): Promise<void> {
		console.log(`\n UserService.createUser(${name}, ${email}, ${age})`);

		const user: User = {
			id: generateUUID(),
			name,
			email,
			age,
			createdAt: new Date(),
		};

		await this.userRepository.save(user);
		console.log(` User created with ID: ${user.id}`);
	}

	async updateUser(id: string, updates: Partial<User>): Promise<void> {
		console.log(`\n UserService.updateUser(${id}, {...})`);

		const existingUser = await this.userRepository.findById(id);
		if (!existingUser) {
			throw new Error(`User ${id} not found`);
		}

		await this.userRepository.update(id, updates);
		console.log(` User ${id} updated`);
	}

	async deleteUser(id: string): Promise<void> {
		console.log(`\n UserService.deleteUser(${id})`);

		const existingUser = await this.userRepository.findById(id);
		if (!existingUser) {
			throw new Error(`User ${id} not found`);
		}

		await this.userRepository.delete(id);
		console.log(` User ${id} deleted`);
	}
}
