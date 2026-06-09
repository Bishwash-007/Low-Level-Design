---
name: low-level-design
description: This skill provides comprehensive guidance for designing and implementing low-level system components using design patterns, SOLID principles, and best practices in Express.js with TypeScript. Use when designing system components, implementing design patterns, applying SOLID principles, architecting database interactions, creating scalable services, or refactoring code for better structure and maintainability.
---

# Low-Level Design (LLD) Skill

## Purpose

This skill enables Claude to assist with low-level design tasks—taking a system requirement and decomposing it into well-architected, maintainable code using proven patterns and principles. It covers design patterns (creational, structural, behavioral), SOLID principles, object-oriented design concepts, and practical implementation patterns for building production-grade systems in Express.js with TypeScript.

## When to Use This Skill

Use this skill when:

- Designing individual services, components, or modules from scratch
- Selecting and implementing appropriate design patterns for a problem
- Refactoring existing code to follow SOLID principles or design patterns
- Architecting database interactions, repositories, and data access layers
- Creating dependency injection, factory, or builder patterns
- Designing notification systems, event handlers, or state machines
- Structuring request/response handlers in Express.js
- Building scalable and testable code architecture
- Creating domain models and entities for business logic
- Implementing caching strategies, proxies, or decorators

## How to Use This Skill

### 1. Design Pattern Selection

To solve a design problem, first identify which pattern(s) apply:

**Creational Patterns** (object creation):

- **Factory**: When you have multiple ways to create similar objects. Use Factory Pattern for creating objects without specifying exact classes.
- **Builder**: When objects have many optional parameters. Use Builder Pattern to construct complex objects step-by-step.
- **Singleton**: When you need exactly one instance across the application. Use for configuration, logging, or database connections.
- **Abstract Factory**: When you have families of related objects. Use for creating suites of related products.
- **Prototype**: When cloning objects is cheaper than creating from scratch. Use for prototypal inheritance patterns.

**Structural Patterns** (object composition):

- **Adapter**: When integrating incompatible interfaces. Use Adapter to make old code work with new interfaces.
- **Decorator**: When adding behavior to objects dynamically. Use for middleware, logging, or feature flags.
- **Facade**: When simplifying complex subsystems. Use to provide simple interface to complex logic.
- **Proxy**: When controlling access to another object. Use for lazy loading, caching, or authorization checks.
- **Bridge**: When decoupling abstraction from implementation. Use for driver/backend flexibility.
- **Composite**: When treating individual objects and compositions uniformly. Use for tree structures.
- **Flyweight**: When optimizing memory with shared objects. Use for connection pooling or cached resources.

**Behavioral Patterns** (object interaction):

- **Observer**: When objects need to react to state changes. Use for event-driven architecture or real-time updates.
- **Strategy**: When swapping algorithms at runtime. Use for pluggable authentication, payment methods, or validation logic.
- **State**: When objects behave differently in different states. Use for order processing, user workflows, or state machines.
- **Command**: When encapsulating requests as objects. Use for queuing, undo/redo, or batch operations.
- **Iterator**: When traversing collections without exposing structure. Use for custom data structure iteration.
- **Template Method**: When defining algorithm skeleton in base class. Use for common workflows with customization points.
- **Mediator**: When reducing coupling between objects. Use for complex interdependencies.
- **Visitor**: When adding operations without modifying classes. Use for AST processing or complex object traversals.
- **Chain of Responsibility**: When handling requests through a chain. Use for middleware, approval workflows, or logging levels.
- **Memento**: When capturing and restoring state. Use for undo/redo functionality.
- **Interpreter**: When parsing and executing domain languages. Use for query builders or expression evaluators.

### 2. Apply SOLID Principles

Structure all designs around SOLID:

**S - Single Responsibility Principle (SRP)**

- Each class/function should have one reason to change
- Separate concerns: domain logic, persistence, presentation

**O - Open/Closed Principle (OCP)**

- Open for extension, closed for modification
- Use abstraction and inheritance for new features without changing existing code

**L - Liskov Substitution Principle (LSP)**

- Derived classes must be substitutable for base classes
- Ensure subtypes don't violate parent contracts

**I - Interface Segregation Principle (ISP)**

- Many client-specific interfaces better than one general-purpose
- Create focused interfaces clients actually need

**D - Dependency Inversion Principle (DIP)**

- Depend on abstractions, not concrete implementations
- Use dependency injection and interfaces for flexibility

### 3. Key Design Concepts

**Abstraction**: Hide implementation details behind interfaces. Use abstract classes and interfaces to define contracts.

**Encapsulation**: Keep data private, provide public methods for controlled access. Protects invariants and allows refactoring.

**Inheritance**: Model "is-a" relationships. Use for code reuse, but prefer composition when possible.

**Polymorphism**: Objects of different types respond to same interface. Enables flexible, extensible code.

**Repository Pattern**: Abstract data access layer. Separate business logic from database queries for testability.

**Service Layer**: Encapsulate business logic separate from controllers. Makes logic reusable and testable.

**Dependency Injection**: Pass dependencies rather than creating them. Improves testability and loose coupling.

### 4. Express.js Specific Patterns

**Middleware Composition**: Use middleware stack for cross-cutting concerns (logging, auth, error handling).

**Controller Layer**: Thin controllers that delegate to services. Controllers handle routing and HTTP details.

**Request/Response DTOs**: Use Data Transfer Objects to shape incoming requests and outgoing responses.

**Error Handling**: Centralized error handler middleware. Create custom error types for different scenarios.

**Async/Await Pattern**: Use async handlers with try/catch for cleaner error handling.

**Type Safety**: Leverage TypeScript for compile-time type checking. Use interfaces for external contracts.

### 5. Implementation Process

When implementing a design:

1. **Identify the abstraction**: Define interfaces/abstract classes first
2. **Implement concrete classes**: Fulfill the abstraction contracts
3. **Inject dependencies**: Pass abstractions, not concrete implementations
4. **Add tests**: Write tests against abstractions for flexibility
5. **Document trade-offs**: Explain why specific patterns were chosen

## References

Consult the following reference materials for detailed explanations and examples:

- `references/design-patterns-guide.md` - Comprehensive guide to all design patterns with use cases
- `references/solid-principles-guide.md` - Deep dive into SOLID principles with real examples
- `references/oops-concepts.md` - Object-oriented programming fundamentals
- `references/uml-diagrams.md` - Visual modeling techniques for design

## Assets

Example TypeScript templates are available in `assets/` for common patterns and architectures:

- Express.js starter project structure
- Service layer template
- Repository pattern template
- Dependency injection container setup
- Error handling middleware
- Request validation middleware

Use these templates as starting points for consistent architecture across projects.

## Workflow for Design Tasks

1. **Understand the requirement** - What behavior needs to be implemented?
2. **Choose appropriate patterns** - Which patterns apply to this problem?
3. **Design with SOLID** - How can SOLID principles improve this design?
4. **Implement in TypeScript** - Create type-safe, expressive code
5. **Structure for Express** - Organize with controllers, services, and repositories
6. **Test the design** - Write tests that verify the abstraction contracts
7. **Document rationale** - Explain why specific patterns were chosen

By following these principles and patterns, create systems that are maintainable, scalable, testable, and resilient to change.
