# Low-Level Design (LLD) Skill for Express.js + TypeScript

## Overview

This Claude skill provides comprehensive guidance for designing and implementing low-level system components using design patterns, SOLID principles, and object-oriented programming best practices in Express.js with TypeScript.

## What's Included

### 📚 Reference Materials

1. **design-patterns-guide.md** - Comprehensive guide covering:
   - Creational Patterns (Factory, Builder, Singleton, Abstract Factory, Prototype)
   - Structural Patterns (Adapter, Decorator, Proxy, Facade, Bridge, Composite, Flyweight)
   - Behavioral Patterns (Observer, Strategy, State, Command, Iterator, Template Method, Mediator, Visitor, Chain of Responsibility, Memento, Interpreter)
   - Real-world use cases and TypeScript examples for each pattern

2. **solid-principles-guide.md** - Deep dive into SOLID principles:
   - Single Responsibility Principle (SRP)
   - Open/Closed Principle (OCP)
   - Liskov Substitution Principle (LSP)
   - Interface Segregation Principle (ISP)
   - Dependency Inversion Principle (DIP)
   - Code examples for violations and solutions
   - Benefits and when to apply each principle

3. **oops-concepts.md** - Object-oriented programming fundamentals:
   - Abstraction, Encapsulation, Inheritance, Polymorphism
   - Composition over Inheritance
   - Association, Aggregation, and Composition
   - Design best practices
   - Access modifiers and their proper use

4. **uml-diagrams.md** - Visual design documentation:
   - Class Diagrams
   - Sequence Diagrams
   - State Diagrams
   - Use Case Diagrams
   - Component Diagrams
   - Activity Diagrams
   - Deployment Diagrams

### 💻 Code Templates & Examples

1. **express-service-template.ts** - Production-ready Express.js application structure:
   - Repository Pattern for data access
   - Service Layer for business logic
   - Controller Layer for HTTP handling
   - Dependency Injection container
   - DTOs (Data Transfer Objects)
   - Error handling with custom error types
   - Middleware setup and error handler
   - Async handler wrapper for clean error handling

2. **design-patterns-examples.ts** - Practical implementation examples:
   - Factory Pattern for notification services
   - Builder Pattern for query construction
   - Strategy Pattern for pricing calculations
   - Decorator Pattern for data processors
   - Observer Pattern for order events
   - State Pattern for order workflow
   - Adapter Pattern for legacy system integration
   - Proxy Pattern with caching and lazy loading
   - Command Pattern for undo/redo functionality

## Quick Start

### When to Use This Skill

✅ Use this skill when:
- Designing individual services or components from scratch
- Selecting appropriate design patterns for a problem
- Refactoring code to follow SOLID principles
- Architecting database interactions and repositories
- Creating scalable, maintainable Express.js applications
- Implementing notification systems or state machines
- Building dependency injection containers
- Designing complex workflows or request handlers

### Common Scenarios

**Scenario 1: Designing a Payment System**
1. Choose appropriate patterns: Strategy (payment methods), Factory (processor creation)
2. Apply SOLID: Depend on abstraction (PaymentProcessor interface), Single Responsibility (separate concerns)
3. Implement: Repository for transactions, Service for business logic, Controller for HTTP
4. Reference: See Strategy Pattern in design-patterns-examples.ts

**Scenario 2: Building a Notification Service**
1. Choose pattern: Observer (multiple notification channels), Factory (creation)
2. Apply SOLID: Interface Segregation (separate interfaces), Dependency Inversion (inject services)
3. Implement: Service for sending, Factory for channel creation
4. Reference: See Factory and Observer patterns in design-patterns-examples.ts

**Scenario 3: Refactoring Legacy Code**
1. Identify violations: Multiple responsibilities, tight coupling, hard to test
2. Apply principles: SRP (split classes), DIP (inject dependencies), OCP (use strategies)
3. Implement: Extract services, create interfaces, use dependency injection
4. Reference: See SOLID principles guide for before/after examples

## Architecture Pattern: Service Layer

All Express.js applications should follow this layered structure:

```
┌─────────────────────┐
│   HTTP Layer        │ (Routes, Controllers)
│   (Express)         │
└──────────────┬──────┘
               │
┌──────────────▼──────┐
│   Service Layer     │ (Business Logic)
│   (TypeScript)      │
└──────────────┬──────┘
               │
┌──────────────▼──────┐
│   Repository Layer  │ (Data Access)
│   (Database)        │
└─────────────────────┘
```

**Benefits:**
- Clear separation of concerns
- Easy to test each layer independently
- Business logic independent of HTTP framework
- Reusable services across different endpoints

## SOLID Principles Summary

| Principle | Focus | Benefit |
|-----------|-------|---------|
| **S**RP | One responsibility per class | Easy to understand and modify |
| **O**CP | Open for extension, closed for modification | Add features without breaking existing code |
| **L**SP | Subtypes are substitutable for base types | Reliable inheritance hierarchies |
| **I**SP | Segregated, focused interfaces | Implement only needed behavior |
| **D**IP | Depend on abstractions, not concrete types | Loose coupling, easy to test |

## Design Patterns Quick Reference

### When to Use Each Pattern

**Creational** (Object Creation):
- Need multiple ways to create similar objects? → **Factory**
- Object has many optional parameters? → **Builder**
- Need exactly one instance? → **Singleton**
- Have families of related objects? → **Abstract Factory**

**Structural** (Object Composition):
- Need to make incompatible interfaces work together? → **Adapter**
- Adding behavior dynamically? → **Decorator**
- Simplifying complex subsystem? → **Facade**
- Controlling access to another object? → **Proxy**
- Complex hierarchies of objects? → **Composite**

**Behavioral** (Object Interaction):
- Objects need to react to state changes? → **Observer**
- Swapping algorithms at runtime? → **Strategy**
- Object behavior depends on state? → **State**
- Encapsulating requests as objects? → **Command**
- Traversing collections without exposing structure? → **Iterator**
- Different implementations of same algorithm? → **Template Method**

## Best Practices

### 1. Always Use Interfaces
```typescript
interface UserRepository { /* ... */ }
class MySQLUserRepository implements UserRepository { /* ... */ }
```

### 2. Inject Dependencies
```typescript
class UserService {
  constructor(private userRepository: UserRepository) {}
}
```

### 3. Keep Classes Focused
- One class should have one reason to change
- Use the single responsibility principle as your guide

### 4. Use DTOs for Request/Response
```typescript
interface CreateUserDTO { email: string; name: string; }
interface UserResponseDTO { id: string; email: string; name: string; }
```

### 5. Centralize Error Handling
```typescript
const errorHandler = (err: Error, req: Request, res: Response) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  }
};
```

## Examples in Repository

The workspace contains additional examples and patterns:
- [Design Patterns folder](../../Design%20Patterns) - Detailed pattern explanations
- [SOLID principles folder](../../SOLID%20principles) - Real implementations
- [OOP concepts folder](../../oops) - OOP fundamentals
- [UML diagrams folder](../../UML%20diagrams) - Visual design documentation

## Next Steps

1. **Review the references** - Start with one pattern or principle that's relevant to your task
2. **Study the examples** - Look at real TypeScript code implementations
3. **Design first** - Use UML diagrams to visualize before coding
4. **Apply SOLID** - Structure your code around these principles
5. **Test thoroughly** - Loose coupling makes unit testing easier

## File Structure

```
low-level-design-skill/
├── SKILL.md                              # Skill description and workflows
├── references/
│   ├── design-patterns-guide.md          # All design patterns explained
│   ├── solid-principles-guide.md         # SOLID principles with examples
│   ├── oops-concepts.md                  # OOP fundamentals
│   └── uml-diagrams.md                   # UML diagram types and examples
└── assets/
    ├── express-service-template.ts       # Production-ready template
    └── design-patterns-examples.ts       # Pattern implementations
```

## Tips for Maximum Effectiveness

1. **Reference the guides while coding** - Keep patterns in mind during design
2. **Use templates as starting points** - Customize for your specific needs
3. **Apply SOLID incrementally** - Don't refactor everything at once
4. **Document your design decisions** - Explain why you chose specific patterns
5. **Test against abstractions** - Mock dependencies for better testing
6. **Iterate and improve** - Low-level design is an evolving process

## Resources

For questions or deeper understanding:
- Review the comprehensive guides in the `references/` folder
- Study the code templates in the `assets/` folder
- Consult UML diagrams to visualize your architecture
- Reference real-world examples in the workspace

---

**Created for:** Low-Level Design in Express.js + TypeScript  
**Last Updated:** 2024  
**Skill Status:** Ready for production use
