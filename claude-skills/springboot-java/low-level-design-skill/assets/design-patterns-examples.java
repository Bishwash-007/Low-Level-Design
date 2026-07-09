// ========== DESIGN PATTERNS EXAMPLES - SPRING BOOT JAVA ==========
// Production-ready implementations with validation and error handling

package com.example.patterns;

import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

// ============ FACTORY PATTERN (With Validation) ============

public interface NotificationChannel {
    void send(String message, String recipient);
}

public class EmailNotification implements NotificationChannel {
    private static final Logger logger = LoggerFactory.getLogger(EmailNotification.class);

    @Override
    public void send(String message, String recipient) {
        if (recipient == null || recipient.isBlank()) {
            throw new IllegalArgumentException("Recipient cannot be null or empty");
        }

        if (!recipient.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format: " + recipient);
        }

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Message cannot be null or empty");
        }

        if (message.length() > 1000) {
            throw new IllegalArgumentException("Message too long (max 1000 chars)");
        }

        logger.info("[EMAIL] Sending to {} - {} chars", recipient, message.length());
    }
}

public class SMSNotification implements NotificationChannel {
    private static final Logger logger = LoggerFactory.getLogger(SMSNotification.class);

    @Override
    public void send(String message, String recipient) {
        if (recipient == null || recipient.isBlank()) {
            throw new IllegalArgumentException("Recipient cannot be null or empty");
        }

        if (!recipient.matches("^\\d{10,15}$")) {
            throw new IllegalArgumentException("Invalid phone number: " + recipient);
        }

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Message cannot be null or empty");
        }

        if (message.length() > 160) {
            throw new IllegalArgumentException("SMS message too long (max 160 chars)");
        }

        logger.info("[SMS] Sending to {} - {} chars", recipient, message.length());
    }
}

public class PushNotification implements NotificationChannel {
    private static final Logger logger = LoggerFactory.getLogger(PushNotification.class);

    @Override
    public void send(String message, String recipient) {
        if (recipient == null || recipient.isBlank()) {
            throw new IllegalArgumentException("Device ID cannot be null or empty");
        }

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Message cannot be null or empty");
        }

        if (message.length() > 500) {
            throw new IllegalArgumentException("Push message too long (max 500 chars)");
        }

        logger.info("[PUSH] Sending to device {} - {} chars", recipient, message.length());
    }
}

@Component
public class NotificationFactory {
    private static final Logger logger = LoggerFactory.getLogger(NotificationFactory.class);
    private static final Set<String> SUPPORTED_TYPES = Set.of("email", "sms", "push");

    public NotificationChannel create(String type) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Notification type cannot be null or empty");
        }

        String lowerType = type.toLowerCase().trim();

        if (!SUPPORTED_TYPES.contains(lowerType)) {
            throw new IllegalArgumentException("Unsupported notification type: " + type);
        }

        logger.info("[Factory] Creating notification channel: {}", lowerType);

        return switch (lowerType) {
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

// ============ BUILDER PATTERN (With Validation) ============

@Data
public class QueryFilter {
    private String field;
    private String operator;
    private Object value;
    private int position;
}

public class QueryBuilder {
    private static final Logger logger = LoggerFactory.getLogger(QueryBuilder.class);
    private static final int MAX_LIMIT = 1000;
    private static final int MIN_LIMIT = 1;
    private final List<QueryFilter> filters = new ArrayList<>();
    private final List<String> sortFields = new ArrayList<>();
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

        logger.debug("[Query] Added filter: {} {} {}", field, operator, value);
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
        logger.debug("[Query] Added sort: {}", field);
        return this;
    }

    public QueryBuilder limit(int limit) {
        if (limit < MIN_LIMIT || limit > MAX_LIMIT) {
            int capped = Math.min(limit, MAX_LIMIT);
            logger.warn("[Query] Limit capped from {} to {}", limit, capped);
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
                skip);

        logger.info("[Query] Built query with {} filters, limit={}, skip={}",
                filters.size(), limit, skip);
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
@AllArgsConstructor
public class QueryOptions {
    private final List<QueryFilter> filters;
    private final List<String> sortFields;
    private final int limit;
    private final int skip;
}

// ============ STRATEGY PATTERN (With Validation) ============

public interface PricingStrategy {
    BigDecimal calculate(BigDecimal basePrice, int quantity);
}

public class RegularPricingStrategy implements PricingStrategy {
    private static final Logger logger = LoggerFactory.getLogger(RegularPricingStrategy.class);

    @Override
    public BigDecimal calculate(BigDecimal basePrice, int quantity) {
        if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Base price cannot be negative");
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        BigDecimal total = basePrice.multiply(BigDecimal.valueOf(quantity))
                .setScale(2, RoundingMode.HALF_UP);

        logger.info("[Strategy] Regular: {} * {} = {}", basePrice, quantity, total);
        return total;
    }
}

public class DiscountPricingStrategy implements PricingStrategy {
    private static final Logger logger = LoggerFactory.getLogger(DiscountPricingStrategy.class);
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
        if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Base price cannot be negative");
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        BigDecimal total = basePrice.multiply(BigDecimal.valueOf(quantity));
        BigDecimal discount = total.multiply(discountPercent).divide(new BigDecimal(100));
        BigDecimal final_price = total.subtract(discount).setScale(2, RoundingMode.HALF_UP);

        logger.info("[Strategy] Discount ({}%): {} * {} - {} = {}",
                discountPercent, basePrice, quantity, discount, final_price);
        return final_price;
    }
}

public class PremiumPricingStrategy implements PricingStrategy {
    private static final Logger logger = LoggerFactory.getLogger(PremiumPricingStrategy.class);

    @Override
    public BigDecimal calculate(BigDecimal basePrice, int quantity) {
        if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Base price cannot be negative");
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        BigDecimal premiumPercent = new BigDecimal(125); // 25% markup
        BigDecimal total = basePrice.multiply(BigDecimal.valueOf(quantity))
                .multiply(premiumPercent).divide(new BigDecimal(100))
                .setScale(2, RoundingMode.HALF_UP);

        logger.info("[Strategy] Premium: {} * {} * 1.25 = {}", basePrice, quantity, total);
        return total;
    }
}

@Service
public class OrderPricingService {
    private static final Logger logger = LoggerFactory.getLogger(OrderPricingService.class);
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
        } catch (IllegalArgumentException e) {
            logger.error("[Service] Calculation failed: {}", e.getMessage());
            throw e;
        }
    }
}

// ============ OBSERVER PATTERN (With Validation) ============

public interface EventObserver {
    void update(OrderEvent event);

    String getId();
}

@Service
public class OrderEventPublisher {
    private static final Logger logger = LoggerFactory.getLogger(OrderEventPublisher.class);
    private final Map<String, EventObserver> observers = new ConcurrentHashMap<>();

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

@Data
public class OrderEvent implements Serializable {
    private String orderId;
    private BigDecimal total;
    private String status;
    private LocalDateTime timestamp;

    public OrderEvent(String orderId, BigDecimal total) {
        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("Order ID required");
        }
        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Total must be positive");
        }

        this.orderId = orderId;
        this.total = total;
        this.timestamp = LocalDateTime.now();
    }
}

// ============ DECORATOR PATTERN (With Validation) ============

public interface DataProcessor {
    String process(String data);
}

public class BasicProcessor implements DataProcessor {
    private static final Logger logger = LoggerFactory.getLogger(BasicProcessor.class);

    @Override
    public String process(String data) {
        if (data == null || data.isBlank()) {
            throw new IllegalArgumentException("Data cannot be null or empty");
        }
        logger.debug("[Processor] Basic processing");
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
    private static final Logger logger = LoggerFactory.getLogger(UpperCaseDecorator.class);

    public UpperCaseDecorator(DataProcessor processor) {
        super(processor);
    }

    @Override
    public String process(String data) {
        if (data == null || data.isBlank()) {
            throw new IllegalArgumentException("Data cannot be null or empty");
        }

        String processed = processor.process(data);
        String result = processed.toUpperCase();

        logger.debug("[Decorator] Uppercase: {} -> {}", processed, result);
        return result;
    }
}

public class TrimDecorator extends ProcessorDecorator {
    private static final Logger logger = LoggerFactory.getLogger(TrimDecorator.class);

    public TrimDecorator(DataProcessor processor) {
        super(processor);
    }

    @Override
    public String process(String data) {
        if (data == null) {
            throw new IllegalArgumentException("Data cannot be null");
        }

        String processed = processor.process(data);
        String result = processed.trim();

        logger.debug("[Decorator] Trim: '{}' -> '{}'", processed, result);
        return result;
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
            logger.info("[Decorator] Result: {} chars", result.length());
            return result;
        } catch (Exception e) {
            logger.error("[Decorator] Error: {}", e.getMessage());
            throw e;
        }
    }
}

// ============ STATE PATTERN (With Validation) ============

public interface OrderState {
    void process(OrderContext context);

    String getStateName();
}

public class PendingState implements OrderState {
    private static final Logger logger = LoggerFactory.getLogger(PendingState.class);

    @Override
    public void process(OrderContext context) {
        logger.info("[State] Order PENDING -> PROCESSING");
        try {
            context.validatePayment();
            context.setState(new ProcessingState());
        } catch (Exception e) {
            logger.error("[State] Payment validation failed: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public String getStateName() {
        return "PENDING";
    }
}

public class ProcessingState implements OrderState {
    private static final Logger logger = LoggerFactory.getLogger(ProcessingState.class);

    @Override
    public void process(OrderContext context) {
        logger.info("[State] Order PROCESSING -> SHIPPED");
        try {
            context.prepareShipment();
            context.setState(new ShippedState());
        } catch (Exception e) {
            logger.error("[State] Shipment preparation failed: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public String getStateName() {
        return "PROCESSING";
    }
}

public class ShippedState implements OrderState {
    private static final Logger logger = LoggerFactory.getLogger(ShippedState.class);

    @Override
    public void process(OrderContext context) {
        logger.info("[State] Order SHIPPED -> DELIVERED");
        context.setState(new DeliveredState());
    }

    @Override
    public String getStateName() {
        return "SHIPPED";
    }
}

public class DeliveredState implements OrderState {
    private static final Logger logger = LoggerFactory.getLogger(DeliveredState.class);

    @Override
    public void process(OrderContext context) {
        logger.info("[State] Order DELIVERED - Complete");
    }

    @Override
    public String getStateName() {
        return "DELIVERED";
    }
}

@Component
public class OrderContext {
    private static final Logger logger = LoggerFactory.getLogger(OrderContext.class);
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
            logger.error("[OrderContext] Process failed: {}", e.getMessage());
            throw e;
        }
    }

    public void validatePayment() {
        logger.debug("[OrderContext] Validating payment");
    }

    public void prepareShipment() {
        logger.debug("[OrderContext] Preparing shipment");
    }

    public int getTransitionCount() {
        return transitionCount;
    }
}

// ============ ADAPTER PATTERN (With Validation) ============

public interface OldPaymentGateway {
    boolean pay(double amount);
}

public interface NewPaymentProcessor {
    CompletableFuture<PaymentResponse> process(PaymentRequest request);
}

public class LegacyPaymentGateway implements OldPaymentGateway {
    private static final Logger logger = LoggerFactory.getLogger(LegacyPaymentGateway.class);

    @Override
    public boolean pay(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        logger.info("[Legacy] Processing payment: {}", amount);
        return true;
    }
}

@Component
public class PaymentAdapter implements NewPaymentProcessor {
    private static final Logger logger = LoggerFactory.getLogger(PaymentAdapter.class);
    private final OldPaymentGateway legacyGateway = new LegacyPaymentGateway();

    @Override
    public CompletableFuture<PaymentResponse> process(PaymentRequest request) {
        if (request == null || request.getAmount() == null
                || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return CompletableFuture.failedFuture(
                    new IllegalArgumentException("Invalid payment request"));
        }

        try {
            logger.info("[Adapter] Converting to legacy format...");
            boolean result = legacyGateway.pay(request.getAmount().doubleValue());

            if (!result) {
                return CompletableFuture.failedFuture(
                        new RuntimeException("Legacy gateway payment failed"));
            }

            PaymentResponse response = new PaymentResponse();
            response.setSuccess(true);
            response.setTransactionId(UUID.randomUUID().toString());

            logger.info("[Adapter] Payment processed successfully");
            return CompletableFuture.completedFuture(response);
        } catch (Exception e) {
            logger.error("[Adapter] Error: {}", e.getMessage());
            return CompletableFuture.failedFuture(e);
        }
    }
}

@Data
public class PaymentRequest {
    private BigDecimal amount;
    private String description;
}

@Data
public class PaymentResponse {
    private boolean success;
    private String transactionId;
}

// ============ COMMAND PATTERN (With Validation & Undo/Redo) ============

public interface Command {
    void execute();

    void undo();

    String getDescription();
}

@Data
public class Light {
    private boolean isOn = false;
    private int brightness = 100;
    private static final Logger logger = LoggerFactory.getLogger(Light.class);

    public void turnOn() {
        if (isOn) {
            throw new IllegalArgumentException("Light is already on");
        }
        isOn = true;
        logger.info("[Light] Turned ON");
    }

    public void turnOff() {
        if (!isOn) {
            throw new IllegalArgumentException("Light is already off");
        }
        isOn = false;
        brightness = 0;
        logger.info("[Light] Turned OFF");
    }

    public void setBrightness(int level) {
        if (level < 0 || level > 100) {
            throw new IllegalArgumentException("Brightness must be between 0 and 100");
        }
        brightness = level;
        logger.info("[Light] Brightness set to {}%", level);
    }
}

public class TurnOnCommand implements Command {
    private final Light light;
    private final boolean previousState;
    private static final Logger logger = LoggerFactory.getLogger(TurnOnCommand.class);

    public TurnOnCommand(Light light) {
        if (light == null) {
            throw new IllegalArgumentException("Light is required");
        }
        this.light = light;
        this.previousState = light.isOn();
    }

    @Override
    public void execute() {
        try {
            light.turnOn();
        } catch (Exception e) {
            logger.error("[Command] Execute failed: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public void undo() {
        try {
            light.turnOff();
        } catch (Exception e) {
            logger.error("[Command] Undo failed: {}", e.getMessage());
        }
    }

    @Override
    public String getDescription() {
        return "TurnOn Light";
    }
}

public class SetBrightnessCommand implements Command {
    private final Light light;
    private final int level;
    private final int previousBrightness;
    private static final Logger logger = LoggerFactory.getLogger(SetBrightnessCommand.class);

    public SetBrightnessCommand(Light light, int level) {
        if (light == null) {
            throw new IllegalArgumentException("Light is required");
        }
        if (level < 0 || level > 100) {
            throw new IllegalArgumentException("Brightness must be between 0 and 100");
        }

        this.light = light;
        this.level = level;
        this.previousBrightness = light.getBrightness();
    }

    @Override
    public void execute() {
        try {
            light.setBrightness(level);
        } catch (Exception e) {
            logger.error("[Command] Execute failed: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public void undo() {
        try {
            light.setBrightness(previousBrightness);
        } catch (Exception e) {
            logger.error("[Command] Undo failed: {}", e.getMessage());
        }
    }

    @Override
    public String getDescription() {
        return "Set Brightness to " + level + "%";
    }
}

@Service
public class CommandInvoker {
    private static final Logger logger = LoggerFactory.getLogger(CommandInvoker.class);
    private final Deque<Command> history = new LinkedList<>();
    private static final int MAX_HISTORY = 100;

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

            logger.info("[Invoker] Executed: {} (History: {})", command.getDescription(), history.size());
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

    public int getHistorySize() {
        return history.size();
    }
}

// Lombok import
import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

/*
 * PRODUCTION FEATURES:
 * All patterns with comprehensive validation
 * Logging at each step with contextual information
 * Error handling with meaningful exceptions
 * Immutability where appropriate
 * Thread-safe implementations (ConcurrentHashMap)
 * Bounds checking and constraint validation
 * Try-catch error handling in all usage points
 * Input sanitization for security
 * Detailed error messages
 */
