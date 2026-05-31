# Dependency Inversion Principle (DIP) - Multi-Database Repository System

## Definition

The **Dependency Inversion Principle** states that:

> **High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.**

This means:
- **Depend on Abstractions**: Use interfaces/abstract classes, not concrete implementations
- **Invert the Dependency**: Instead of high-level code importing low-level code, both depend on abstractions
- **Flexible Implementation**: Swap implementations without changing high-level code
- **Testability**: Easy to inject mock implementations for testing

## Why is DIP Important?

### 1. **Flexibility**
Swap implementations without changing high-level business logic.

### 2. **Testability**
Inject mock repositories for testing without touching real databases.

### 3. **Maintainability**
Changes to database implementations don't affect business logic.

### 4. **Scalability**
Add new database types or storage systems easily.

### 5. **Decoupling**
Business logic is independent of infrastructure details.

## How to Achieve DIP

### 1. **Define Abstractions**
Create interfaces that represent contracts, not specific implementations.

### 2. **Depend on Interfaces**
High-level code should depend on interfaces, not concrete classes.

### 3. **Use Dependency Injection**
Pass dependencies via constructor, not creating them internally.

### 4. **Factory Pattern**
Use factories to create appropriate implementations based on configuration.

### 5. **Repository Pattern**
Isolate data access logic behind a consistent interface.

---

## Common DIP Violations

###  Violation 1: Direct Dependency on Concrete Class

```typescript
// BAD - High-level module directly depends on low-level database
import { MySQLDatabase } from './MySQLDatabase';

export class UserService {
  private db: MySQLDatabase = new MySQLDatabase(); // Direct dependency!

  getUser(id: string): User {
    return this.db.executeQuery(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Problem: If you want to switch to MongoDB, you must modify UserService!
```

###  Violation 2: Creating Dependencies Internally

```typescript
// BAD - Service creates its own dependencies
export class ProductService {
  constructor() {
    this.database = new PostgresDatabase(); // Creates its own dependency
    this.cache = new RedisCache();
    this.logger = new FileLogger();
  }

  // Can't test or swap these easily!
}
```

###  Violation 3: Conditional Instantiation

```typescript
// BAD - High-level code knows about all implementations
export class DataStore {
  constructor(type: string) {
    if (type === 'mysql') {
      this.repo = new MySQLRepository();
    } else if (type === 'mongo') {
      this.repo = new MongoRepository();
    } else if (type === 'postgres') {
      this.repo = new PostgresRepository();
    }
    // High-level code tightly coupled to all implementations!
  }
}
```

---

## Multi-Database Repository System Architecture

### System Overview

```
BEFORE DIP (BAD - Tightly Coupled):
┌──────────────────────────────────────┐
│      UserService (High-level)        │
├──────────────────────────────────────┤
│   Directly uses:                     │
│   - new MySQLDatabase()              │
│   - new MongoDBDatabase()            │
│   - new PostgresDatabase()           │
└──────────────────────────────────────┘
         ↓↓↓ Hard dependency on concrete classes

AFTER DIP (GOOD - Loosely Coupled):
┌──────────────────────────────────────┐
│      UserService (High-level)        │
├──────────────────────────────────────┤
│   Depends on abstraction:            │
│   - UserRepository interface         │
└──────────────────────────────────────┘
         ↑
         │ (depends on)
┌────────────────────────────────────────┐
│    UserRepository (Abstraction)        │
├────────────────────────────────────────┤
│    - findById(id: string): User        │
│    - save(user: User): void            │
│    - delete(id: string): void          │
│    - findAll(): User[]                 │
└────────────────────────────────────────┘
         ↑↑↑ (implements)
         │
    ┌────┴───────────┬──────────────┐
    │                │              │
┌───────────┐  ┌──────────┐  ┌───────────────┐
│  MySQL    │  │ MongoDB  │  │ PostgreSQL    │
│Repository │  │Repository│  │ Repository    │
└───────────┘  └──────────┘  └───────────────┘
(Low-level modules depend on abstraction)
```

### Core Concept

1. **Define Abstraction**: `UserRepository` interface
2. **High-level Code**: `UserService` depends on `UserRepository`
3. **Low-level Code**: `MySQLUserRepository`, `MongoUserRepository`, etc. implement `UserRepository`
4. **Dependency Injection**: Pass the correct repository implementation at runtime

---

## DIP-Compliant Multi-Database System

### Core Abstraction - User Repository

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

/**
 * Abstraction: Repository interface
 * High-level code depends on this interface
 * Low-level code implements this interface
 */
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(id: string, user: Partial<User>): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### Low-Level Implementation 1: MySQL Repository

```typescript
export class MySQLUserRepository implements UserRepository {
  private connection: MySQLConnection;

  constructor(connectionString: string) {
    this.connection = new MySQLConnection(connectionString);
  }

  async findById(id: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = ?`;
    const result = await this.connection.execute(query, [id]);
    return result[0] || null;
  }

  async findAll(): Promise<User[]> {
    const query = `SELECT * FROM users`;
    return await this.connection.execute(query);
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = ?`;
    const result = await this.connection.execute(query, [email]);
    return result[0] || null;
  }

  async save(user: User): Promise<void> {
    const query = `INSERT INTO users (id, name, email, age, createdAt) VALUES (?, ?, ?, ?, ?)`;
    await this.connection.execute(query, [
      user.id,
      user.name,
      user.email,
      user.age,
      user.createdAt,
    ]);
  }

  async update(id: string, user: Partial<User>): Promise<void> {
    const fields = Object.keys(user)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.values(user);
    const query = `UPDATE users SET ${fields} WHERE id = ?`;
    await this.connection.execute(query, [...values, id]);
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM users WHERE id = ?`;
    await this.connection.execute(query, [id]);
  }
}
```

### Low-Level Implementation 2: MongoDB Repository

```typescript
export class MongoUserRepository implements UserRepository {
  private collection: MongoCollection;

  constructor(connectionString: string) {
    const client = new MongoClient(connectionString);
    const db = client.db('appdb');
    this.collection = db.collection('users');
  }

  async findById(id: string): Promise<User | null> {
    return await this.collection.findOne({ id });
  }

  async findAll(): Promise<User[]> {
    return await this.collection.find({}).toArray();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.collection.findOne({ email });
  }

  async save(user: User): Promise<void> {
    await this.collection.insertOne(user);
  }

  async update(id: string, user: Partial<User>): Promise<void> {
    await this.collection.updateOne({ id }, { $set: user });
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ id });
  }
}
```

### Low-Level Implementation 3: PostgreSQL Repository

```typescript
export class PostgresUserRepository implements UserRepository {
  private pool: PostgresPool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async findAll(): Promise<User[]> {
    const result = await this.pool.query('SELECT * FROM users');
    return result.rows;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0] || null;
  }

  async save(user: User): Promise<void> {
    await this.pool.query(
      'INSERT INTO users (id, name, email, age, createdAt) VALUES ($1, $2, $3, $4, $5)',
      [user.id, user.name, user.email, user.age, user.createdAt],
    );
  }

  async update(id: string, user: Partial<User>): Promise<void> {
    const keys = Object.keys(user);
    const values = Object.values(user);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    await this.pool.query(`UPDATE users SET ${setClause} WHERE id = $${keys.length + 1}`, [
      ...values,
      id,
    ]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
```

### High-Level Code - User Service

```typescript
/**
 * High-level module that depends on abstraction
 * UserService doesn't care which database is used
 * It depends on UserRepository interface, not concrete implementations
 */

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async createUser(name: string, email: string, age: number): Promise<void> {
    const user: User = {
      id: generateUUID(),
      name,
      email,
      age,
      createdAt: new Date(),
    };
    await this.userRepository.save(user);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    await this.userRepository.update(id, updates);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
```

---

## Dependency Injection & Factory Pattern

### Dependency Injection Container

```typescript
export class DIContainer {
  private repositories: Map<string, UserRepository> = new Map();

  registerRepository(name: string, repository: UserRepository): void {
    this.repositories.set(name, repository);
  }

  getRepository(name: string): UserRepository {
    const repo = this.repositories.get(name);
    if (!repo) {
      throw new Error(`Repository '${name}' not found`);
    }
    return repo;
  }

  createUserService(repositoryName: string): UserService {
    const repository = this.getRepository(repositoryName);
    return new UserService(repository);
  }
}
```

### Factory for Creating Repositories

```typescript
export enum DatabaseType {
  MySQL = 'mysql',
  MongoDB = 'mongodb',
  PostgreSQL = 'postgres',
  InMemory = 'inmemory',
}

export class RepositoryFactory {
  static createRepository(
    type: DatabaseType,
    connectionString: string,
  ): UserRepository {
    switch (type) {
      case DatabaseType.MySQL:
        return new MySQLUserRepository(connectionString);
      case DatabaseType.MongoDB:
        return new MongoUserRepository(connectionString);
      case DatabaseType.PostgreSQL:
        return new PostgresUserRepository(connectionString);
      case DatabaseType.InMemory:
        return new InMemoryUserRepository();
      default:
        throw new Error(`Unknown database type: ${type}`);
    }
  }
}
```

### Application Setup (Composition Root)

```typescript
// Configuration
const databaseType = process.env.DB_TYPE || 'mysql';
const connectionString = process.env.DATABASE_URL;

// Create appropriate repository based on configuration
const userRepository = RepositoryFactory.createRepository(
  databaseType as DatabaseType,
  connectionString,
);

// Inject into service
const userService = new UserService(userRepository);

// Now userService works with ANY database!
export { userService };
```

---

## DIP in Action

### Example 1: Switch Databases with One Line

```typescript
// Production: Use MySQL
const repository = RepositoryFactory.createRepository(
  DatabaseType.MySQL,
  'mysql://user:pass@localhost/db',
);
const service = new UserService(repository);

// Later: Switch to MongoDB
const repository = RepositoryFactory.createRepository(
  DatabaseType.MongoDB,
  'mongodb://localhost:27017/db',
);
const service = new UserService(repository); // Same interface!
```

### Example 2: Testing with Mock Repository

```typescript
// Create mock repository for testing
class MockUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    return {
      id,
      name: 'Mock User',
      email: 'mock@example.com',
      age: 30,
      createdAt: new Date(),
    };
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findByEmail(email: string): Promise<User | null> {
    return null;
  }

  async save(user: User): Promise<void> {}
  async update(id: string, user: Partial<User>): Promise<void> {}
  async delete(id: string): Promise<void> {}
}

// Test with mock - no database needed!
const mockRepo = new MockUserRepository();
const service = new UserService(mockRepo);

test('getUserById returns user', async () => {
  const user = await service.getUserById('123');
  expect(user?.name).toBe('Mock User');
});
```

### Example 3: Add New Database Type

```typescript
// NEW: In-Memory Repository for testing/caching
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async update(id: string, updates: Partial<User>): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, { ...user, ...updates });
    }
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}

// Automatically works with UserService!
// No changes to existing code needed!
```

---

## Benefits Demonstrated

### 1. **No Changes to Business Logic**

```typescript
// UserService never changes, regardless of database
// Just inject different repository implementations
const mysqlService = new UserService(new MySQLUserRepository(connStr));
const mongoService = new UserService(new MongoUserRepository(connStr));
const pgService = new UserService(new PostgresUserRepository(connStr));

// All work identically from UserService perspective
await mysqlService.createUser('Alice', 'alice@example.com', 30);
await mongoService.createUser('Bob', 'bob@example.com', 25);
await pgService.createUser('Charlie', 'charlie@example.com', 35);
```

### 2. **Easy Testing**

```typescript
// No need for real database in tests
const mockRepo = new MockUserRepository();
const service = new UserService(mockRepo);

// Fast, isolated tests
await service.createUser('Test', 'test@example.com', 25);
```

### 3. **Configuration-Driven Behavior**

```typescript
// Switch databases via environment variable
const dbType = process.env.DATABASE_TYPE; // 'mysql', 'mongo', 'postgres'
const repository = RepositoryFactory.createRepository(dbType, connStr);
const service = new UserService(repository);
```

### 4. **Scalability**

```typescript
// Add new database without changing:
// - UserService
// - RepositoryFactory (just add new case)
// - Existing repositories

export class CassandraUserRepository implements UserRepository {
  // Implement interface
  async findById(id: string): Promise<User | null> { /* ... */ }
  // ... rest of methods
}
```

---

## DIP Violations to Avoid

###  Bad: High-Level Depends on Low-Level

```typescript
// VIOLATES DIP - Service directly creates/imports concrete database
export class UserService {
  private db = new MySQLDatabase(); // Tightly coupled!

  async getUser(id: string): Promise<User> {
    return this.db.executeQuery(`SELECT * FROM users WHERE id = ${id}`);
  }
}
```

###  Bad: Service Knows About Multiple Implementations

```typescript
// VIOLATES DIP - High-level code knows about all databases
export class UserService {
  constructor(dbType: 'mysql' | 'mongo' | 'postgres') {
    if (dbType === 'mysql') this.db = new MySQLDatabase();
    else if (dbType === 'mongo') this.db = new MongoDatabase();
    else this.db = new PostgresDatabase();
  }
}
```

###  Bad: Creating Dependencies Internally

```typescript
// VIOLATES DIP - Service creates its own dependencies
export class UserService {
  private logger = new ConsoleLogger();
  private cache = new RedisCache();
  private db = new MySQLDatabase();

  // Can't swap implementations, can't test properly
}
```

---

## Summary

### DIP Ensures:
 High-level code independent of low-level details  
 Easy to swap implementations  
 Excellent testability  
 Configuration-driven behavior  
 New implementations don't affect existing code  
 Loose coupling between layers  

### Key Pattern: Dependency Injection
- Define abstractions (interfaces)
- Inject dependencies via constructor
- Depend on interfaces, not implementations
- Use factories for object creation

### Remember:
> **"Depend on abstractions, not on concretions."**

By following DIP, you create flexible, maintainable, and testable systems where business logic is truly independent of infrastructure details.
