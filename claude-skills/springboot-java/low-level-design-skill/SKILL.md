---
name: Spring Boot Low-Level Design
description: Comprehensive skill for designing and implementing low-level system architectures using Spring Boot and Java. Covers design patterns, SOLID principles, OOP concepts, and production-ready service implementations.
---

# Spring Boot Low-Level Design Skill

This skill provides expert guidance for low-level design decisions in Spring Boot applications, covering design patterns, SOLID principles, OOP fundamentals, and production-ready architecture patterns.

## When to Use This Skill

Use this skill when:

- **Designing services**: Building Spring Boot microservices with clean architecture
- **Selecting design patterns**: Choosing appropriate creational, structural, or behavioral patterns for Java
- **Applying SOLID principles**: Refactoring code to follow single responsibility, open/closed, Liskov substitution, interface segregation, and dependency inversion
- **Structuring projects**: Organizing Spring Boot projects with controllers, services, repositories, and DTOs
- **Implementing patterns**: Implementing Factory, Builder, Singleton, Decorator, Observer, Strategy, State, Adapter, Proxy, Command patterns
- **Writing OOP code**: Using abstraction, encapsulation, inheritance, polymorphism, and composition
- **Production features**: Adding logging, error handling, validation, graceful shutdown, health checks
- **Testing architecture**: Designing testable services with dependency injection
- **Database patterns**: Implementing Repository Pattern, JPA entities, DAO patterns
- **API design**: Creating clean REST controllers with validation and error handling

## Design Patterns Selection Guide

### **Creational Patterns** (Object Creation)

- **Factory Pattern**: Service instantiation, notification channel creation, data source management
- **Builder Pattern**: Complex query building, configuration object creation, request/response construction
- **Singleton Pattern**: Database connections, configuration loaders, service instances
- **Abstract Factory**: Multi-tenant systems, payment gateway abstraction
- **Prototype**: Cloning entities for templates, copying configurations

### **Structural Patterns** (Object Composition)

- **Adapter Pattern**: Legacy system integration, payment gateway adapters, protocol converters
- **Decorator Pattern**: Feature wrapping, logging decorators, caching layers
- **Proxy Pattern**: Lazy loading JPA entities, caching, access control
- **Facade Pattern**: Simplified APIs over complex subsystems
- **Bridge Pattern**: Abstracting implementations from interfaces
- **Composite Pattern**: Hierarchical entities (organizational units, permission trees)
- **Flyweight Pattern**: String interning, cached objects

### **Behavioral Patterns** (Object Interaction)

- **Observer Pattern**: Event listeners, notification systems, pub-sub messaging
- **Strategy Pattern**: Payment algorithms, discount strategies, sorting algorithms
- **State Pattern**: Order workflows, user authentication states
- **Command Pattern**: Task queuing, undo/redo operations, audit logging
- **Template Method**: Base service templates with customizable steps
- **Iterator Pattern**: Collection traversal, pagination
- **Visitor Pattern**: AST walking, report generation
- **Mediator Pattern**: Request routing, event coordination
- **Chain of Responsibility**: Security filter chains, request processing
- **Memento Pattern**: State snapshots, transaction savepoints
- **Interpreter Pattern**: Query DSLs, rule engines

## SOLID Principles Overview

1. **Single Responsibility**: Each class has one reason to change
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Subtypes are substitutable for supertypes
4. **Interface Segregation**: Many specific interfaces over one general
5. **Dependency Inversion**: Depend on abstractions, not concretions

## Spring Boot Specific Patterns

### **Layered Architecture**

```
Controller (REST endpoints)
    ↓
Service Layer (business logic, transactions)
    ↓
Repository Layer (data access, JPA)
    ↓
Database
```

### **Dependency Injection**

- Spring manages bean lifecycle
- Constructor injection for immutable dependencies
- Field injection for optional dependencies
- Setter injection for property-based config

### **Transaction Management**

- `@Transactional` for database operations
- Isolation levels and propagation settings
- Error handling with rollback

### **Configuration Management**

- `application.properties` / `application.yml`
- `@Configuration` classes
- `@ConfigurationProperties` for type-safe config
- Spring Profiles for environment-specific settings

### **Error Handling**

- `@ControllerAdvice` for global exception handling
- `@ExceptionHandler` methods
- Custom exception classes
- HTTP status code mapping

### **Middleware/Filters**

- `OncePerRequestFilter` for request processing
- Request/response interceptors
- Logging and tracing
- Security filters

## Implementation Workflow

### **Step 1: Understand the Problem**

- Identify the business requirement
- List constraints and scale requirements
- Determine integration points

### **Step 2: Select Design Pattern**

- Choose creational pattern for object creation
- Choose structural pattern for object composition
- Choose behavioral pattern for interactions
- Evaluate trade-offs

### **Step 3: Design Entities & DTOs**

- Create domain entities (JPA @Entity)
- Design Data Transfer Objects
- Map between entities and DTOs
- Define relationships

### **Step 4: Implement Repository Layer**

- Extend `JpaRepository<T, ID>`
- Add custom query methods with `@Query`
- Implement filtering and pagination
- Add error handling for database operations

### **Step 5: Implement Service Layer**

- Add business logic in `@Service` classes
- Implement validation and error handling
- Add `@Transactional` where needed
- Handle cross-cutting concerns

### **Step 6: Implement Controller Layer**

- Create `@RestController` classes
- Map endpoints to service methods
- Add validation with `@Valid`
- Handle exceptions with status codes

### **Step 7: Add Production Features**

- Logging with SLF4J/Logback
- Request tracing with correlation IDs
- Health checks with Actuator
- Graceful shutdown with lifecycle hooks
- Metrics and monitoring
- Security with Spring Security

## Key Spring Boot Annotations

| Annotation                       | Purpose                      |
| -------------------------------- | ---------------------------- |
| `@SpringBootApplication`         | Main application entry point |
| `@RestController`                | REST API controller          |
| `@Service`                       | Business logic service       |
| `@Repository`                    | Data access layer            |
| `@Configuration`                 | Spring configuration         |
| `@Bean`                          | Bean definition              |
| `@Autowired`                     | Dependency injection         |
| `@Value`                         | Property injection           |
| `@RequestMapping`                | URL mapping                  |
| `@GetMapping`, `@PostMapping`    | HTTP method shortcuts        |
| `@PathVariable`, `@RequestParam` | Request parameter binding    |
| `@RequestBody`                   | JSON binding                 |
| `@Valid`                         | Validation trigger           |
| `@Transactional`                 | Transaction management       |
| `@ExceptionHandler`              | Exception handling           |
| `@ControllerAdvice`              | Global exception handling    |
| `@Profile`                       | Environment-specific beans   |
| `@ConfigurationProperties`       | Type-safe configuration      |

## Best Practices

1. **Always validate input** at controller and service layers
2. **Use transactions** for data consistency
3. **Implement proper error handling** with meaningful error codes
4. **Log at appropriate levels** (debug, info, warn, error)
5. **Use DTOs** to separate API contracts from entities
6. **Implement pagination** for large datasets
7. **Use Spring Security** for authentication/authorization
8. **Add Actuator endpoints** for health and metrics
9. **Implement graceful shutdown** for clean termination
10. **Write integration tests** with `@SpringBootTest`

## Related Resources

- Design Patterns Guide: Comprehensive coverage of 23+ patterns with Java examples
- SOLID Principles Guide: Before/after code examples for each principle
- OOP Concepts: Abstraction, encapsulation, inheritance, polymorphism
- UML Diagrams: Visual documentation for architecture
- Spring Boot Service Template: Production-ready service implementation
- Design Patterns Examples: Ready-to-use pattern implementations
