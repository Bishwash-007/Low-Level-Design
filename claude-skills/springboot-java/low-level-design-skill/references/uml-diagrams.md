// ========== UML DIAGRAMS - SPRING BOOT JAVA ==========
// This guide covers 7 UML diagram types with Java/Spring examples

// ============ 1. CLASS DIAGRAM ============
// Purpose: Show classes, relationships, and attributes
// When to use: Document system structure, design phase

/*
┌─────────────────────────────────┐
│         Order (abstract)         │
├─────────────────────────────────┤
│ - orderId: String               │
│ - status: OrderStatus           │
│ - items: List<OrderItem>        │
├─────────────────────────────────┤
│ + getTotal(): BigDecimal        │
│ + process(): void               │
│ + cancel(): void                │
└─────────────────────────────────┘
           △
           │ implements
           │
    ┌──────┴──────┐
    │             │
┌───┴────┐   ┌────┴───┐
│ Online │   │ Pickup │
│ Order  │   │ Order  │
└────────┘   └────────┘

    Association (has-a)
    Order ──────◇──── OrderItem
        1            *

    Inheritance (is-a)
    OnlineOrder ─▲─ Order

    Dependency (uses)
    Order ┄┄┄┄> PaymentService
*/

// ============ 2. SEQUENCE DIAGRAM ============
// Purpose: Show interactions between objects over time
// When to use: Document workflows, process flows

/*
USER         CONTROLLER      SERVICE         REPOSITORY      DATABASE
 │               │               │               │               │
 ├─ POST /users─>│               │               │               │
 │               ├─ validate ────>│               │               │
 │               │               ├─ check exists>│               │
 │               │               │               ├─ query ──────>│
 │               │               │               │<─ result ─────┤
 │               │               │<─ false ──────┤               │
 │               │<─ valid ──────┤               │               │
 │               ├─ save ───────────────────────>│               │
 │               │               │               ├─ insert ─────>│
 │               │               │               │<─ OK ─────────┤
 │               │<─ user ───────┤               │               │
 │<─ 201 OK ─────┤               │               │               │
 │ {user}        │               │               │               │
*/

// Java/Spring example:
@RestController
@RequestMapping("/users")
public class UserController {
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}

@Service
public class UserService {
    @Transactional
    public User createUser(CreateUserRequest request) {
        // Check if user exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateUserException("User already exists");
        }
        
        // Create and save
        User user = new User(request);
        return userRepository.save(user);
    }
}

// ============ 3. STATE DIAGRAM ============
// Purpose: Show state transitions and events
// When to use: Workflow, state machines, process states

/*
        ┌─────────────┐
        │   PENDING   │
        └──────┬──────┘
               │ payment_received
               ▼
        ┌─────────────┐
        │ PROCESSING  │
        └──────┬──────┘
               │ inventory_reserved
               ▼
        ┌─────────────┐
        │  SHIPPED    │
        └──────┬──────┘
               │ delivered
               ▼
        ┌─────────────┐
        │ DELIVERED   │
        └─────────────┘

Events:
- payment_received: Payment processed successfully
- inventory_reserved: Items reserved from warehouse
- delivered: Package delivered to customer
- cancel: User cancels order (from PENDING/PROCESSING)
*/

// Java/Spring implementation:
public enum OrderStatus {
    PENDING,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED
}

@Entity
@Data
public class Order {
    @Id
    private String orderId;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

@Service
public class OrderStateMachine {
    @Transactional
    public void process(Order order, String event) {
        switch(order.getStatus()) {
            case PENDING:
                if ("payment_received".equals(event)) {
                    order.setStatus(OrderStatus.PROCESSING);
                }
                break;
                
            case PROCESSING:
                if ("inventory_reserved".equals(event)) {
                    order.setStatus(OrderStatus.SHIPPED);
                }
                break;
                
            case SHIPPED:
                if ("delivered".equals(event)) {
                    order.setStatus(OrderStatus.DELIVERED);
                }
                break;
                
            case DELIVERED:
                // Terminal state
                break;
        }
        
        orderRepository.save(order);
    }
}

// ============ 4. USE CASE DIAGRAM ============
// Purpose: Show system functionality from user perspective
// When to use: Requirements gathering, system scope

/*
                ┌──────────────────────┐
                │   Order System       │
                └──────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    ┌───▼──┐       ┌────▼───┐     ┌────▼───┐
    │ User │       │ Admin  │     │ System │
    └───┬──┘       └────┬───┘     └────┬───┘
        │               │              │
        ├─ Place Order ─┤              │
        │   ◇           │              │
        │   │           │              │
        │   └─ Process Payment         │
        │   └─ Reserve Inventory       │
        │   └─ Assign Warehouse        │
        │                              │
        ├─ Track Order                 │
        │   ◇                          │
        │                              │
        └─ Cancel Order                │
                                       │
                    ┌──────────────────┼
                    │ Send Notification│
                    │ Update Inventory │
                    │ Generate Reports │
*/

// ============ 5. COMPONENT DIAGRAM ============
// Purpose: Show system components and dependencies
// When to use: Architecture documentation, deployment planning

/*
┌─────────────────────────────────────────────────────────────┐
│                    Spring Boot Application                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐                                       │
│  │  REST Controller │◄─────────────────────┐               │
│  └────────┬─────────┘                       │               │
│           │                           HTTP Requests        │
│           │                                 │               │
│  ┌────────▼──────────┐                     │               │
│  │ Service Layer     │◄───────────────────┘               │
│  │ (Business Logic)  │                                     │
│  └────────┬──────────┘                                     │
│           │                                                │
│  ┌────────▼──────────────┐      ┌──────────────────┐      │
│  │ Repository Layer      │     │ Database/JPA    │      │
│  │ (Data Access)         │────▶│ (Persistence)   │      │
│  └───────────────────────┘     └──────────────────┘      │
│                                                             │
│  ┌──────────────────┐                                      │
│  │ Cross-Cutting    │                                      │
│  │ Concerns:        │                                      │
│  │ - Logging        │                                      │
│  │ - Security       │                                      │
│  │ - Transactions   │                                      │
│  └──────────────────┘                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  External Services   │
    │ - Payment Gateway    │
    │ - Email Service      │
    │ - SMS Service        │
    └──────────────────────┘
*/

// ============ 6. ACTIVITY DIAGRAM ============
// Purpose: Show workflow, process flow, activities
// When to use: Process documentation, workflow design

/*
                    ┌─────────────────┐
                    │  Start Order    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Validate Input  │
                    └────────┬────────┘
                             │
                    ┌────────▼─────────────────┐
                    │ Check User Exists?       │
                    └────────┬─────────────────┘
                             │
               ┌─────────────┼─────────────┐
               │ NO          │ YES         │
               ▼             ▼             
         ┌─────────┐   ┌─────────────────┐
         │ Reject  │   │ Process Payment │
         └────┬────┘   └────────┬────────┘
              │                  │
              │        ┌─────────▼──────────┐
              │        │ Payment Success?   │
              │        └──┬────────────┬────┘
              │           │            │
              │        NO │            │ YES
              │           ▼            ▼
              │      ┌──────────┐ ┌──────────────┐
              │      │ Rollback │ │ Reserve Stock│
              │      └──┬───────┘ └────────┬─────┘
              │         │                  │
              └────────┬┼─────────────────┬┘
                       │                  │
                    ┌──▼──────────────────▼──┐
                    │ Send Confirmation      │
                    └──────────┬─────────────┘
                               │
                    ┌──────────▼────────┐
                    │  End (Success)    │
                    └───────────────────┘
*/

// Java implementation:
@Service
public class OrderProcessor {
    @Transactional
    public OrderResponse processOrder(CreateOrderRequest request) {
        // Validate input
        validateOrderRequest(request);
        
        // Check user exists
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        // Process payment
        PaymentResponse payment = paymentService.charge(request.getAmount());
        
        if (!payment.isSuccess()) {
            // Rollback
            throw new PaymentFailedException("Payment failed");
        }
        
        // Reserve stock
        for (OrderItem item : request.getItems()) {
            inventoryService.reserve(item.getProductId(), item.getQuantity());
        }
        
        // Create order
        Order order = new Order(request);
        orderRepository.save(order);
        
        // Send confirmation
        notificationService.sendConfirmation(user.getEmail(), order);
        
        return new OrderResponse(order);
    }
}

// ============ 7. DEPLOYMENT DIAGRAM ============
// Purpose: Show physical deployment architecture
// When to use: Infrastructure planning, deployment documentation

/*
┌──────────────────────────────────────────────────────────────┐
│                      Production Environment                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Client Machines                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Browser   │  │   Mobile   │  │  Desktop   │            │
│  │            │  │     App    │  │    App     │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        └────────────────┼───────────────┘                    │
│                         │                                     │
│                    (HTTP/HTTPS)                              │
│                         │                                     │
│        ┌────────────────▼────────────────┐                   │
│        │   Load Balancer (Nginx)        │                   │
│        └────────────────┬────────────────┘                   │
│                         │                                     │
│        ┌────────────────┼────────────────┐                   │
│        │                │                │                   │
│   ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐             │
│   │ App Pod 1│    │ App Pod 2│    │ App Pod 3│             │
│   │(Spring   │    │(Spring   │    │(Spring   │             │
│   │Boot)     │    │Boot)     │    │Boot)     │             │
│   └────┬─────┘    └────┬─────┘    └────┬─────┘             │
│        └────────────────┼───────────────┘                    │
│                         │                                     │
│                    (JDBC/TCP)                                │
│                         │                                     │
│        ┌────────────────▼────────────────┐                   │
│        │   Database Cluster             │                   │
│        │  (PostgreSQL Primary +         │                   │
│        │   Replication Secondaries)     │                   │
│        └────────────────────────────────┘                   │
│                                                              │
│        ┌────────────────────────────────┐                    │
│        │  Cache Layer (Redis)           │                    │
│        │  Shared across all pods        │                    │
│        └────────────────────────────────┘                    │
│                                                              │
│        ┌────────────────────────────────┐                    │
│        │  Message Queue (RabbitMQ)      │                    │
│        │  Asynchronous processing       │                    │
│        └────────────────────────────────┘                    │
└──────────────────────────────────────────────────────────────┘

Kubernetes deployment:
- 3 replicas for high availability
- Load balanced across nodes
- Auto-scaling based on CPU/Memory
- Rolling updates for zero downtime
*/

// ============ DIAGRAM SELECTION GUIDE ============
/*
Diagram Type        | Purpose                              | When to Use
--------------------|--------------------------------------|---------------------------
Class               | System structure                     | Design phase, Documentation
Sequence            | Object interactions over time        | API flows, Complex workflows
State                | State transitions                    | State machines, Workflows
Use Case            | System functionality                 | Requirements, Scope
Component           | System architecture                  | High-level design
Activity            | Process flow, workflow               | Business processes
Deployment          | Physical infrastructure              | DevOps, Infrastructure planning
*/
