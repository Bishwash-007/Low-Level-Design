# Spring Boot Low-Level Design Skill - Complete Guide

## Overview

This skill provides everything you need to design and implement production-ready Spring Boot applications. It includes:

- **SKILL.md**: When and how to use this skill
- **references/design-patterns-guide.md**: 23+ design patterns with Java/Spring Boot examples
- **references/solid-principles-guide.md**: SOLID principles with before/after code
- **references/oops-concepts.md**: Object-oriented programming fundamentals
- **references/uml-diagrams.md**: UML diagram types and examples
- **assets/springboot-service-template.java**: Production-ready service implementation
- **assets/design-patterns-examples.java**: Real-world pattern implementations

## Quick Start Scenarios

### Scenario 1: Build a Payment Processing Service

**Requirement**: Create a payment service that supports multiple payment gateways (Credit Card, PayPal, Stripe) with different processing rules.

**Solution**: Use Factory Pattern for gateway creation, Strategy Pattern for fee calculations.

```java
// Create interfaces for extensibility
public interface PaymentGateway {
    PaymentResponse processPayment(PaymentRequest request);
}

// Concrete implementations
public class CreditCardGateway implements PaymentGateway { }
public class PayPalGateway implements PaymentGateway { }

// Factory for creation
@Component
public class PaymentGatewayFactory {
    public PaymentGateway create(String type) {
        return switch(type) {
            case "creditcard" -> new CreditCardGateway();
            case "paypal" -> new PayPalGateway();
            default -> throw new IllegalArgumentException("Unknown gateway: " + type);
        };
    }
}

// Strategy for fee calculation
public interface FeeStrategy {
    BigDecimal calculate(BigDecimal amount);
}

// Service using patterns
@Service
public class PaymentService {
    private final PaymentGatewayFactory gatewayFactory;
    private final FeeStrategy feeStrategy;
    
    public PaymentResponse pay(PaymentRequest request) {
        PaymentGateway gateway = gatewayFactory.create(request.getGatewayType());
        BigDecimal fees = feeStrategy.calculate(request.getAmount());
        return gateway.processPayment(request);
    }
}
```

### Scenario 2: Build an Order Management System with State Machine

**Requirement**: Manage order lifecycle (Pending → Processing → Shipped → Delivered) with validation at each step.

**Solution**: Use State Pattern with Spring State Machine.

```java
// Entities with state
@Entity
public class Order {
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
}

// State handling
@Service
public class OrderService {
    @Transactional
    public void processOrder(Long orderId) {
        Order order = findById(orderId);
        switch(order.getStatus()) {
            case PENDING:
                validatePayment(order);
                order.setStatus(OrderStatus.PROCESSING);
                break;
            case PROCESSING:
                prepareShipment(order);
                order.setStatus(OrderStatus.SHIPPED);
                break;
            // ... more states
        }
        save(order);
    }
}
```

### Scenario 3: Refactor Legacy Monolith with SOLID Principles

**Requirement**: Refactor tightly coupled legacy code following SOLID principles.

**Solution**: 
- Single Responsibility: Separate concerns into different services
- Open/Closed: Use inheritance/interfaces for extension
- Liskov Substitution: Ensure subtypes replace parent types
- Interface Segregation: Break large interfaces into smaller ones
- Dependency Inversion: Inject abstractions, not concretions

```java
// Before: Tightly coupled
@Service
public class UserService {
    private final MySQLUserRepository repo = new MySQLUserRepository();
    private final GmailNotificationService notif = new GmailNotificationService();
    public void createUser(User user) { /* complex logic */ }
}

// After: Loosely coupled with SOLID principles
@Service
public class UserService {
    private final UserRepository userRepository; // Abstraction
    private final NotificationService notificationService; // Abstraction
    
    public UserService(UserRepository repo, NotificationService notif) {
        this.userRepository = repo;
        this.notificationService = notif;
    }
    
    @Transactional
    public void createUser(User user) {
        userRepository.save(user);
        notificationService.notifyUserCreated(user);
    }
}

// Can now use any repository implementation
@Configuration
public class AppConfig {
    @Bean
    public UserRepository userRepository() {
        return new PostgresUserRepository(); // Easy to swap
    }
    
    @Bean
    public NotificationService notificationService() {
        return new EmailNotificationService(); // Easy to swap
    }
}
```

## Architecture Pattern: Layered Architecture

```
┌─────────────────────────────────────────────┐
│         REST Controller Layer               │
│  (Request validation, routing, responses)   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│        Service Layer (@Service)             │
│  (Business logic, transactions, workflows)  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│      Repository Layer (JpaRepository)       │
│  (Data access, queries, entity mapping)     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Database / External APIs           │
│      (MySQL, PostgreSQL, MongoDB, etc)      │
└─────────────────────────────────────────────┘

### Cross-Cutting Concerns:
- Logging (SLF4J)
- Exception Handling (@ControllerAdvice)
- Transaction Management (@Transactional)
- Security (Spring Security)
- Validation (@Valid, @Validated)
```

## SOLID Principles Quick Reference

| Principle | Description | Spring Example |
|-----------|-------------|-----------------|
| **S** - Single Responsibility | One reason to change | Separate UserService, EmailService, PaymentService |
| **O** - Open/Closed | Extend, don't modify | Use PaymentGateway interface, add new implementations |
| **L** - Liskov Substitution | Subtypes replace parents | All PaymentGateway impls work in same context |
| **I** - Interface Segregation | Specific interfaces | PaymentService, NotificationService, not AllServices |
| **D** - Dependency Inversion | Depend on abstractions | Inject UserRepository, not MySQLUserRepository |

## Design Patterns Quick Reference

| Pattern | Use Case | Spring Feature |
|---------|----------|---|
| Factory | Create different objects (payment gateways) | `@Component` with factory methods |
| Builder | Build complex objects (queries, configs) | Lombok `@Builder` or manual builder |
| Singleton | Single instance (services, configs) | `@Service`, `@Component` (Spring handles) |
| Strategy | Swap algorithms (fee calculation) | Strategy interface + implementations |
| Observer | Event notification (user created) | `ApplicationEventPublisher` |
| Decorator | Add behavior (logging, caching) | `@Aspect` with AOP |
| Proxy | Lazy loading, access control | Spring proxy beans, `@Lazy` |
| State | Workflow management (order status) | Enum + conditional logic or Spring State Machine |
| Adapter | Legacy system integration | Adapter interface + implementation |
| Command | Task queuing, undo/redo | `Callable<T>`, message queues |

## Production Features Checklist

-  Input validation at controller and service layers
-  Comprehensive error handling with @ControllerAdvice
-  Structured logging with SLF4J/Logback
-  Request tracing with correlation IDs
-  Database connection pooling
-  Transaction management with @Transactional
-  DTOs for API contracts
-  Pagination for large datasets
-  Caching strategies
-  Health checks with Actuator
-  Graceful shutdown
-  Security with Spring Security
-  Integration tests with @SpringBootTest
-  API documentation (Swagger/OpenAPI)

## Common Spring Boot Configuration

```yaml
# application.yml
spring:
  application:
    name: my-service
  
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: password
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
  
  logging:
    level:
      root: INFO
      com.example: DEBUG

server:
  port: 8080
  servlet:
    context-path: /api
  shutdown: graceful
  
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized
```

## Next Steps

1. **Review Design Patterns Guide**: See 23+ patterns with Java implementations
2. **Study SOLID Principles**: Learn violations and solutions with code examples
3. **Use Service Template**: Copy and adapt the production-ready service template
4. **Implement Patterns**: Use design pattern examples as starting points
5. **Build Your Service**: Apply patterns and principles to your business logic
