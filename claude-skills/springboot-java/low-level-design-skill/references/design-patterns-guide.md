// ========== DESIGN PATTERNS GUIDE - SPRING BOOT JAVA ==========
// This guide covers 23 design patterns with Java/Spring Boot examples

// ========== CREATIONAL PATTERNS ==========

// ============ SINGLETON PATTERN ============
// Problem: Need a single instance of a class throughout the application
// Solution: Restrict instantiation to one object
// Benefits: Controlled resource access, memory efficiency, thread-safe

@Component
public class DatabaseConnection {
    private static DatabaseConnection instance;
    private final DataSource dataSource;
    
    private DatabaseConnection() {
        // Spring manages singleton - private constructor
        this.dataSource = createDataSource();
    }
    
    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }
    
    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
    
    private DataSource createDataSource() {
        // Create HikariCP connection pool
        return new HikariDataSource();
    }
}

// Spring handles singleton by default
@Service // Singleton by default
public class UserService {
    // Instances of this service are guaranteed to be single
}

// ============ FACTORY PATTERN ============
// Problem: Create objects without specifying exact classes
// Solution: Use factory methods to create instances
// Benefits: Decoupling, flexibility, centralized creation logic

public interface NotificationService {
    void send(String message, String recipient);
}

public class EmailNotification implements NotificationService {
    @Override
    public void send(String message, String recipient) {
        if (!recipient.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email: " + recipient);
        }
        System.out.println("[EMAIL] Sending to " + recipient + ": " + message);
    }
}

public class SMSNotification implements NotificationService {
    @Override
    public void send(String message, String recipient) {
        if (recipient.length() < 10) {
            throw new IllegalArgumentException("Invalid phone: " + recipient);
        }
        System.out.println("[SMS] Sending to " + recipient + ": " + message);
    }
}

@Component
public class NotificationFactory {
    private static final Set<String> SUPPORTED_TYPES = Set.of("email", "sms", "push");
    
    public NotificationService create(String type) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Notification type cannot be null or empty");
        }
        
        if (!SUPPORTED_TYPES.contains(type.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported notification type: " + type);
        }
        
        return switch(type.toLowerCase()) {
            case "email" -> new EmailNotification();
            case "sms" -> new SMSNotification();
            case "push" -> new PushNotification();
            default -> throw new IllegalArgumentException("Unknown type: " + type);
        };
    }
    
    public Set<String> getSupportedTypes() {
        return Collections.unmodifiableSet(SUPPORTED_TYPES);
    }
}

// Usage with error handling
@Service
public class NotificationUseCase {
    private final NotificationFactory factory;
    
    public void notifyUser(String type, String message, String recipient) {
        try {
            NotificationService service = factory.create(type);
            service.send(message, recipient);
        } catch (IllegalArgumentException e) {
            System.err.println("[ERROR] Invalid notification: " + e.getMessage());
            throw e;
        }
    }
}

// ============ BUILDER PATTERN ============
// Problem: Construct complex objects step by step
// Solution: Use builder to configure object before creation
// Benefits: Readability, flexibility, immutability

@Data
public class QueryFilter {
    private String field;
    private String operator;
    private Object value;
    private int position;
}

public class QueryBuilder {
    private static final int MAX_LIMIT = 1000;
    private static final int MIN_LIMIT = 1;
    private List<QueryFilter> filters = new ArrayList<>();
    private List<String> sortFields = new ArrayList<>();
    private int limit = 50;
    private int skip = 0;
    
    public QueryBuilder where(String field, String operator, Object value) {
        if (field == null || field.isBlank()) {
            throw new IllegalArgumentException("Field cannot be null or empty");
        }
        
        String sanitizedField = field.replaceAll("[^a-zA-Z0-9_]", "");
        if (sanitizedField.isEmpty()) {
            throw new IllegalArgumentException("Field contains invalid characters: " + field);
        }
        
        Set<String> validOps = Set.of("=", "!=", ">", "<", ">=", "<=", "IN", "LIKE");
        if (!validOps.contains(operator)) {
            throw new IllegalArgumentException("Invalid operator: " + operator);
        }
        
        if (value == null) {
            throw new IllegalArgumentException("Value cannot be null");
        }
        
        QueryFilter filter = new QueryFilter();
        filter.setField(sanitizedField);
        filter.setOperator(operator);
        filter.setValue(value);
        filter.setPosition(filters.size());
        filters.add(filter);
        
        return this;
    }
    
    public QueryBuilder sort(String field) {
        if (field == null || field.isBlank()) {
            throw new IllegalArgumentException("Sort field cannot be null");
        }
        
        String sanitizedField = field.replaceAll("[^a-zA-Z0-9_\\-]", "");
        if (sanitizedField.isEmpty()) {
            throw new IllegalArgumentException("Sort field contains invalid characters");
        }
        
        sortFields.add(sanitizedField);
        return this;
    }
    
    public QueryBuilder limit(int limit) {
        if (limit < MIN_LIMIT || limit > MAX_LIMIT) {
            int capped = Math.min(limit, MAX_LIMIT);
            System.out.println("[QueryBuilder] Warning: limit capped to " + capped);
            this.limit = capped;
        } else {
            this.limit = limit;
        }
        return this;
    }
    
    public QueryBuilder skip(int skip) {
        if (skip < 0) {
            throw new IllegalArgumentException("Skip cannot be negative");
        }
        this.skip = skip;
        return this;
    }
    
    public QueryOptions build() {
        QueryOptions options = new QueryOptions(
            Collections.unmodifiableList(new ArrayList<>(filters)),
            Collections.unmodifiableList(new ArrayList<>(sortFields)),
            limit,
            skip
        );
        return options;
    }
    
    public void reset() {
        filters.clear();
        sortFields.clear();
        limit = 50;
        skip = 0;
    }
}

@Data
@Getter
public class QueryOptions {
    private final List<QueryFilter> filters;
    private final List<String> sortFields;
    private final int limit;
    private final int skip;
}

// Usage with error handling
@Service
public class QueryUseCase {
    public void searchUsers() {
        try {
            QueryOptions options = new QueryBuilder()
                .where("age", ">", 18)
                .where("status", "=", "ACTIVE")
                .sort("createdAt")
                .limit(100)
                .skip(0)
                .build();
            
            System.out.println("[Query] Built query with " + options.getFilters().size() + " filters");
        } catch (IllegalArgumentException e) {
            System.err.println("[ERROR] Query building failed: " + e.getMessage());
        }
    }
}

// ============ ABSTRACT FACTORY PATTERN ============
// Problem: Create families of related objects
// Solution: Define abstract factory with multiple concrete factories
// Benefits: Consistent object creation, family relationships

public interface PaymentGateway {
    PaymentResponse processPayment(BigDecimal amount, String reference);
}

public interface RefundService {
    RefundResponse refund(String transactionId, BigDecimal amount);
}

public abstract class PaymentFactory {
    public abstract PaymentGateway createPaymentGateway();
    public abstract RefundService createRefundService();
}

public class StripePaymentFactory extends PaymentFactory {
    @Override
    public PaymentGateway createPaymentGateway() {
        return new StripePaymentGateway();
    }
    
    @Override
    public RefundService createRefundService() {
        return new StripeRefundService();
    }
}

public class PayPalPaymentFactory extends PaymentFactory {
    @Override
    public PaymentGateway createPaymentGateway() {
        return new PayPalPaymentGateway();
    }
    
    @Override
    public RefundService createRefundService() {
        return new PayPalRefundService();
    }
}

// ============ PROTOTYPE PATTERN ============
// Problem: Clone complex objects
// Solution: Implement Cloneable interface for deep copying
// Benefits: Efficient object creation, independent copies

@Entity
@Data
@Getter
public class UserTemplate implements Cloneable {
    private String name;
    private String email;
    private String role;
    private Map<String, String> permissions;
    
    @Override
    public UserTemplate clone() throws CloneNotSupportedException {
        UserTemplate clone = (UserTemplate) super.clone();
        clone.permissions = new HashMap<>(this.permissions);
        return clone;
    }
}

// ========== STRUCTURAL PATTERNS ==========

// ============ ADAPTER PATTERN ============
// Problem: Use incompatible interfaces together
// Solution: Create adapter that translates one interface to another
// Benefits: Legacy system integration, interface compatibility

public interface OldPaymentGateway {
    boolean pay(double amount);
}

public interface NewPaymentProcessor {
    CompletableFuture<PaymentResponse> process(PaymentRequest request);
}

public class LegacyPaymentGateway implements OldPaymentGateway {
    @Override
    public boolean pay(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        System.out.println("[Legacy] Processing payment: " + amount);
        return true;
    }
}

@Component
public class PaymentAdapter implements NewPaymentProcessor {
    private final OldPaymentGateway legacyGateway;
    
    public PaymentAdapter() {
        this.legacyGateway = new LegacyPaymentGateway();
    }
    
    @Override
    public CompletableFuture<PaymentResponse> process(PaymentRequest request) {
        if (request == null || request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return CompletableFuture.failedFuture(
                new IllegalArgumentException("Invalid payment request")
            );
        }
        
        try {
            System.out.println("[Adapter] Converting to legacy format...");
            boolean result = legacyGateway.pay(request.getAmount().doubleValue());
            
            if (!result) {
                return CompletableFuture.failedFuture(
                    new PaymentException("Legacy gateway payment failed")
                );
            }
            
            PaymentResponse response = new PaymentResponse();
            response.setSuccess(true);
            response.setTransactionId(UUID.randomUUID().toString());
            
            System.out.println("[Adapter] Payment processed successfully");
            return CompletableFuture.completedFuture(response);
        } catch (Exception e) {
            System.err.println("[Adapter] Error: " + e.getMessage());
            return CompletableFuture.failedFuture(e);
        }
    }
}

// ============ DECORATOR PATTERN ============
// Problem: Add behavior to objects dynamically
// Solution: Wrap objects with decorators
// Benefits: Flexible behavior addition, avoids class explosion

public interface DataProcessor {
    String process(String data);
}

public class BasicProcessor implements DataProcessor {
    @Override
    public String process(String data) {
        if (data == null || data.isBlank()) {
            throw new IllegalArgumentException("Data cannot be null or empty");
        }
        return data;
    }
}

public abstract class ProcessorDecorator implements DataProcessor {
    protected DataProcessor processor;
    
    public ProcessorDecorator(DataProcessor processor) {
        if (processor == null) {
            throw new IllegalArgumentException("Processor cannot be null");
        }
        this.processor = processor;
    }
    
    @Override
    public abstract String process(String data);
}

public class UpperCaseDecorator extends ProcessorDecorator {
    public UpperCaseDecorator(DataProcessor processor) {
        super(processor);
    }
    
    @Override
    public String process(String data) {
        if (data == null || data.isBlank()) {
            throw new IllegalArgumentException("Data cannot be null or empty");
        }
        String processed = processor.process(data);
        return processed.toUpperCase();
    }
}

public class TrimDecorator extends ProcessorDecorator {
    public TrimDecorator(DataProcessor processor) {
        super(processor);
    }
    
    @Override
    public String process(String data) {
        if (data == null) {
            throw new IllegalArgumentException("Data cannot be null");
        }
        String processed = processor.process(data);
        return processed.trim();
    }
}

public class LoggingDecorator extends ProcessorDecorator {
    private static final Logger logger = LoggerFactory.getLogger(LoggingDecorator.class);
    
    public LoggingDecorator(DataProcessor processor) {
        super(processor);
    }
    
    @Override
    public String process(String data) {
        if (data == null) {
            throw new IllegalArgumentException("Data cannot be null");
        }
        
        String truncated = data.length() > 50 ? data.substring(0, 50) + "..." : data;
        logger.info("[Decorator] Processing: {}", truncated);
        
        try {
            String result = processor.process(data);
            logger.info("[Decorator] Result: {}", result.length() + " chars");
            return result;
        } catch (Exception e) {
            logger.error("[Decorator] Error: {}", e.getMessage());
            throw e;
        }
    }
}

// ============ PROXY PATTERN ============
// Problem: Control access and lazy load expensive objects
// Solution: Create proxy that defers creation/access
// Benefits: Lazy initialization, access control, caching

public interface UserRepository {
    User findById(Long id);
    void save(User user);
}

@Component
public class UserRepositoryProxy implements UserRepository {
    private UserRepository realRepository = null;
    private final Map<Long, User> cache = new ConcurrentHashMap<>();
    private static final long CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    private final Map<Long, Long> cacheTimestamps = new ConcurrentHashMap<>();
    
    @Override
    public User findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        
        // Check cache
        if (cache.containsKey(id)) {
            Long timestamp = cacheTimestamps.get(id);
            if (timestamp != null && System.currentTimeMillis() - timestamp < CACHE_TTL) {
                System.out.println("[Proxy] Cache hit for user: " + id);
                return cache.get(id);
            }
            cache.remove(id);
            cacheTimestamps.remove(id);
        }
        
        // Lazy load real repository
        if (realRepository == null) {
            System.out.println("[Proxy] Lazy loading UserRepository...");
            realRepository = new JpaUserRepository();
        }
        
        try {
            User user = realRepository.findById(id);
            if (user != null) {
                cache.put(id, user);
                cacheTimestamps.put(id, System.currentTimeMillis());
            }
            return user;
        } catch (Exception e) {
            System.err.println("[Proxy] Error: " + e.getMessage());
            throw new RuntimeException("Failed to load user", e);
        }
    }
    
    @Override
    public void save(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        if (realRepository == null) {
            realRepository = new JpaUserRepository();
        }
        
        realRepository.save(user);
        cache.put(user.getId(), user);
    }
}

// ============ FACADE PATTERN ============
// Problem: Complex subsystem interface
// Solution: Provide simplified unified interface
// Benefits: Decoupling, simplified usage

@Service
public class PaymentFacade {
    private final NotificationFactory notificationFactory;
    private final PaymentFactory paymentFactory;
    private final AuditService auditService;
    
    @Transactional
    public PaymentResponse processPaymentWithNotification(PaymentRequest request) {
        try {
            // Validate
            if (request == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Invalid payment request");
            }
            
            // Process payment
            PaymentGateway gateway = paymentFactory.createPaymentGateway();
            PaymentResponse response = gateway.processPayment(
                request.getAmount(), 
                request.getReference()
            );
            
            // Audit
            auditService.logPayment(request, response);
            
            // Notify
            NotificationService notifier = notificationFactory.create("email");
            notifier.send("Payment processed: " + response.getTransactionId(), request.getEmail());
            
            return response;
        } catch (Exception e) {
            System.err.println("[Facade] Error: " + e.getMessage());
            throw e;
        }
    }
}

// ========== BEHAVIORAL PATTERNS ==========

// ============ OBSERVER PATTERN ============
// Problem: Notify multiple objects about state changes
// Solution: Define one-to-many relationship with notifications
// Benefits: Loose coupling, event-driven architecture

public interface EventObserver {
    void update(OrderEvent event);
    String getId();
}

@Component
public class OrderEventPublisher {
    private final Map<String, EventObserver> observers = new ConcurrentHashMap<>();
    private static final Logger logger = LoggerFactory.getLogger(OrderEventPublisher.class);
    
    public void attach(EventObserver observer) {
        if (observer == null || observer.getId() == null) {
            throw new IllegalArgumentException("Observer must have valid ID");
        }
        
        observers.put(observer.getId(), observer);
        logger.info("[Observer] Attached observer: {}", observer.getId());
    }
    
    public void detach(String observerId) {
        if (observerId == null || observerId.isBlank()) {
            throw new IllegalArgumentException("Observer ID required");
        }
        
        observers.remove(observerId);
        logger.info("[Observer] Detached observer: {}", observerId);
    }
    
    public void notifyAll(OrderEvent event) {
        if (event == null || event.getOrderId() == null) {
            throw new IllegalArgumentException("Event must have order ID");
        }
        
        int successCount = 0;
        for (EventObserver observer : observers.values()) {
            try {
                observer.update(event);
                successCount++;
            } catch (Exception e) {
                logger.error("[Observer] Failed to notify {}: {}", observer.getId(), e.getMessage());
            }
        }
        
        logger.info("[Observer] Notified {}/{} observers", successCount, observers.size());
    }
    
    public int getObserverCount() {
        return observers.size();
    }
}

// ============ STRATEGY PATTERN ============
// Problem: Multiple algorithms with runtime selection
// Solution: Encapsulate algorithms in strategy objects
// Benefits: Flexibility, easy to swap, testable

public interface PricingStrategy {
    BigDecimal calculate(BigDecimal basePrice, int quantity);
    void validate(BigDecimal basePrice);
}

public class RegularPricingStrategy implements PricingStrategy {
    @Override
    public BigDecimal calculate(BigDecimal basePrice, int quantity) {
        validate(basePrice);
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        return basePrice.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
    }
    
    @Override
    public void validate(BigDecimal basePrice) {
        if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
    }
}

public class DiscountPricingStrategy implements PricingStrategy {
    private final BigDecimal discountPercent;
    
    public DiscountPricingStrategy(BigDecimal discountPercent) {
        if (discountPercent == null || discountPercent.compareTo(BigDecimal.ZERO) < 0 
            || discountPercent.compareTo(new BigDecimal(100)) > 0) {
            throw new IllegalArgumentException("Discount must be between 0 and 100");
        }
        this.discountPercent = discountPercent;
    }
    
    @Override
    public BigDecimal calculate(BigDecimal basePrice, int quantity) {
        validate(basePrice);
        BigDecimal total = basePrice.multiply(BigDecimal.valueOf(quantity));
        BigDecimal discount = total.multiply(discountPercent).divide(new BigDecimal(100));
        return total.subtract(discount).setScale(2, RoundingMode.HALF_UP);
    }
    
    @Override
    public void validate(BigDecimal basePrice) {
        if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
    }
}

@Service
public class OrderPricingService {
    private PricingStrategy strategy;
    
    public void setStrategy(PricingStrategy strategy) {
        if (strategy == null) {
            throw new IllegalArgumentException("Strategy cannot be null");
        }
        this.strategy = strategy;
    }
    
    public BigDecimal calculatePrice(BigDecimal basePrice, int quantity) {
        if (strategy == null) {
            throw new IllegalStateException("Pricing strategy not set");
        }
        try {
            return strategy.calculate(basePrice, quantity);
        } catch (Exception e) {
            System.err.println("[Strategy] Calculation failed: " + e.getMessage());
            throw e;
        }
    }
}

// ============ STATE PATTERN ============
// Problem: Object behavior varies by state
// Solution: Encapsulate states as separate objects
// Benefits: State-specific logic, cleaner transitions

public interface OrderState {
    void process(OrderContext context);
    String getStateName();
}

public class PendingState implements OrderState {
    @Override
    public void process(OrderContext context) {
        System.out.println("[State] Order PENDING -> PROCESSING");
        try {
            // Validate payment
            context.validatePayment();
            context.setState(new ProcessingState());
        } catch (Exception e) {
            System.err.println("[State] Payment validation failed: " + e.getMessage());
            throw e;
        }
    }
    
    @Override
    public String getStateName() {
        return "PENDING";
    }
}

public class ProcessingState implements OrderState {
    @Override
    public void process(OrderContext context) {
        System.out.println("[State] Order PROCESSING -> SHIPPED");
        try {
            context.prepareShipment();
            context.setState(new ShippedState());
        } catch (Exception e) {
            System.err.println("[State] Shipment preparation failed: " + e.getMessage());
            throw e;
        }
    }
    
    @Override
    public String getStateName() {
        return "PROCESSING";
    }
}

public class ShippedState implements OrderState {
    @Override
    public void process(OrderContext context) {
        System.out.println("[State] Order SHIPPED -> DELIVERED");
        context.setState(new DeliveredState());
    }
    
    @Override
    public String getStateName() {
        return "SHIPPED";
    }
}

public class DeliveredState implements OrderState {
    @Override
    public void process(OrderContext context) {
        System.out.println("[State] Order DELIVERED - Complete");
    }
    
    @Override
    public String getStateName() {
        return "DELIVERED";
    }
}

@Component
public class OrderContext {
    private OrderState currentState = new PendingState();
    private static final int MAX_STATE_TRANSITIONS = 10;
    private int transitionCount = 0;
    
    public void setState(OrderState state) {
        if (state == null) {
            throw new IllegalArgumentException("State cannot be null");
        }
        
        transitionCount++;
        if (transitionCount > MAX_STATE_TRANSITIONS) {
            throw new IllegalStateException("Maximum state transitions exceeded");
        }
        
        currentState = state;
    }
    
    public void process() {
        try {
            currentState.process(this);
        } catch (Exception e) {
            System.err.println("[OrderContext] Process failed: " + e.getMessage());
            throw e;
        }
    }
    
    // Methods called by states
    public void validatePayment() { /* ... */ }
    public void prepareShipment() { /* ... */ }
}

// ============ COMMAND PATTERN ============
// Problem: Encapsulate requests as objects
// Solution: Create command objects for operations
// Benefits: Undo/redo, command queuing, logging

public interface Command {
    void execute();
    void undo();
    String getDescription();
}

@Entity
public class UserCommand implements Command {
    private User user;
    private User previousState;
    
    @Override
    public void execute() {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        this.previousState = user.clone();
        System.out.println("[Command] Creating user: " + user.getName());
        // Save user
    }
    
    @Override
    public void undo() {
        System.out.println("[Command] Undoing user creation");
        // Restore previous state
    }
    
    @Override
    public String getDescription() {
        return "Create User: " + user.getName();
    }
}

@Component
public class CommandInvoker {
    private final Deque<Command> history = new LinkedList<>();
    private static final int MAX_HISTORY = 100;
    private static final Logger logger = LoggerFactory.getLogger(CommandInvoker.class);
    
    public void executeCommand(Command command) {
        if (command == null) {
            throw new IllegalArgumentException("Command cannot be null");
        }
        
        try {
            command.execute();
            history.push(command);
            
            if (history.size() > MAX_HISTORY) {
                history.removeLast();
            }
            
            logger.info("[Invoker] Executed: {}", command.getDescription());
        } catch (Exception e) {
            logger.error("[Invoker] Command failed: {}", e.getMessage());
            throw e;
        }
    }
    
    public void undo() {
        if (history.isEmpty()) {
            logger.warn("[Invoker] No commands to undo");
            return;
        }
        
        Command command = history.pop();
        command.undo();
        logger.info("[Invoker] Undid: {}", command.getDescription());
    }
}

// ========== PATTERN SELECTION SUMMARY TABLE ==========
/*
Creational Patterns:
  Singleton      | Single instance across app (Services, Configs)
  Factory        | Create objects without specifying class (NotificationFactory)
  Builder        | Construct complex objects step by step (QueryBuilder)
  Abstract Fact  | Create families of related objects (PaymentFactory)
  Prototype      | Clone complex objects (UserTemplate)

Structural Patterns:
  Adapter        | Use incompatible interfaces (LegacyPaymentAdapter)
  Decorator      | Add behavior dynamically (LoggingDecorator)
  Proxy          | Control access, lazy loading (UserRepositoryProxy)
  Facade         | Simplified unified interface (PaymentFacade)
  Bridge         | Separate abstraction from impl
  Composite      | Hierarchical tree structures
  Flyweight      | Share common data

Behavioral Patterns:
  Observer       | Notify multiple objects (OrderEventPublisher)
  Strategy       | Swap algorithms (PricingStrategy)
  State          | Vary behavior by state (OrderState)
  Command        | Encapsulate requests (CommandInvoker)
  Template Method| Define algorithm skeleton
  Iterator       | Access elements sequentially
  Visitor        | Perform operations on elements
  Mediator       | Coordinate interactions
  Chain of Resp  | Pass request along chain
  Memento        | Capture internal state
  Interpreter    | Define language grammar
*/
