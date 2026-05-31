import { UserService } from './UserService';
import { UserRepository } from './Abstractions';
import { RepositoryFactory, DatabaseType } from './RepositoryFactory';

/**
 * Dependency Injection Container
 *
 * Manages object creation and dependency injection
 * Central configuration point for the application
 */

export class DIContainer {
	private repositories: Map<string, UserRepository> = new Map();
	private services: Map<string, UserService> = new Map();

	/**
	 * Register a repository with a name
	 */
	registerRepository(name: string, repository: UserRepository): void {
		this.repositories.set(name, repository);
		console.log(` Repository '${name}' registered`);
	}

	/**
	 * Get a registered repository
	 */
	getRepository(name: string): UserRepository {
		const repo = this.repositories.get(name);
		if (!repo) {
			throw new Error(`Repository '${name}' not registered`);
		}
		return repo;
	}

	/**
	 * Create and register repository from database type
	 */
	createAndRegisterRepository(name: string, type: DatabaseType): void {
		const repo = RepositoryFactory.createRepository(type);
		this.registerRepository(name, repo);
	}

	/**
	 * Register a service with a name
	 */
	registerService(name: string, service: UserService): void {
		this.services.set(name, service);
		console.log(` Service '${name}' registered`);
	}

	/**
	 * Get a registered service
	 */
	getService(name: string): UserService {
		const service = this.services.get(name);
		if (!service) {
			throw new Error(`Service '${name}' not registered`);
		}
		return service;
	}

	/**
	 * Create a service with a specific repository
	 */
	createService(serviceName: string, repositoryName: string): UserService {
		const repository = this.getRepository(repositoryName);
		const service = new UserService(repository);
		this.registerService(serviceName, service);
		return service;
	}

	/**
	 * List all registered repositories
	 */
	getRepositoryNames(): string[] {
		return Array.from(this.repositories.keys());
	}

	/**
	 * List all registered services
	 */
	getServiceNames(): string[] {
		return Array.from(this.services.keys());
	}

	/**
	 * Clear all registrations
	 */
	clear(): void {
		this.repositories.clear();
		this.services.clear();
	}
}
