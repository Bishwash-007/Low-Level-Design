# System Design Prompt: Robust Large-Scale Logistics Service

You are a system design expert helping build a large-scale logistics platform using Spring Boot and Java. Use the Spring Boot Low-Level Design Skill from `/claude-skills/springboot-java/low-level-design-skill/` to guide your architectural and implementation decisions.

## 📋 Problem Statement

Design a robust, large-scale logistics service system that connects shippers with carriers to transport goods efficiently. The system must handle real-time tracking, dynamic routing, payment processing, and support millions of daily shipments at enterprise scale.

**Real-world context**: Similar to systems like Uber Freight, Amazon Logistics, or Flipkart's delivery network.

---

## 🎯 Core Functional Requirements

### 1. Shipment Management

- Create shipment with pickup/delivery addresses, items (weight, dimensions, fragility)
- Support multiple pickup/delivery points per shipment
- Batch multiple shipments for same geographic route
- Handle special items (hazardous materials, temperature-controlled, fragile)
- Shipment status tracking: PENDING → CONFIRMED → PICKED_UP → IN_TRANSIT → DELIVERED → COMPLETED

### 2. Real-Time Tracking

- Track shipment location updated in real-time
- Driver location updates every 5 seconds
- Estimated delivery time recalculated continuously
- Proof of delivery (photo capture, digital signature, barcode/QR scan)
- Last-mile transparency for customers

### 3. Route Optimization

- Optimize routes for multiple stops (Traveling Salesman Problem variant)
- Constraints: vehicle capacity, time windows, driver availability, traffic
- Support for time-restricted deliveries (morning 6-9 AM, afternoon 2-5 PM slots)
- Dynamic re-optimization when new orders added mid-route
- Minimize cost while meeting SLAs

### 4. Driver Assignment & Management

- Intelligent driver-to-shipment matching based on:
  - Current location, vehicle capacity, available time
  - Driver skills (hazmat certified, can handle fragile goods)
  - Historical acceptance rate, customer ratings
  - Workload balance across team
- Driver mobile app with turn-by-turn navigation
- Real-time communication channel between driver and customer
- Driver availability calendar (working hours, days off)

### 5. Billing & Payment Processing

- Dynamic pricing based on:
  - Distance, weight, delivery urgency
  - Surge pricing during peak hours
  - Special handling charges (hazmat, temperature control)
- Payment collection from customers
- Driver payouts with commission structure
- Invoice generation and payment reconciliation
- Support for multiple payment methods

### 6. Notification System

- **Customer notifications**: order confirmed, picked up, in transit, out for delivery, delivered, issues
- **Driver notifications**: new shipment assigned, customer called you, route updated, payment received
- **Admin alerts**: SLA violations, payment failures, system anomalies
- Multi-channel: SMS, push notifications, email (with priority levels)

### 7. Analytics & Reporting

- Real-time dashboard: active shipments, driver utilization, on-time delivery %
- Historical reports: revenue, cost analysis, driver performance, customer satisfaction
- Predictive analytics: demand forecasting, optimal pricing, capacity planning

---

## ⚡ Non-Functional Requirements

| Requirement                 | Target                                     | Priority | Notes                           |
| --------------------------- | ------------------------------------------ | -------- | ------------------------------- |
| **Peak Traffic**            | 500K req/sec                               | Critical | 5x normal during peak hours     |
| **Order Placement Latency** | <100ms p99                                 | Critical | Customer creates order          |
| **Route Calculation**       | <5 sec for 1000 stops                      | Critical | Complex optimization            |
| **Tracking Update Delay**   | <10 sec end-to-end                         | High     | Driver → Server → Customer      |
| **API Response Time**       | <200ms p95                                 | High     | All customer-facing APIs        |
| **Payment Processing**      | <500ms                                     | Critical | Exactly-once semantics required |
| **Data Consistency**        | Strong for payments, Eventual for tracking | Critical | Payment ≠ Tracking              |
| **System Uptime**           | 99.99% (52.6 min downtime/year)            | Critical | 4 nines SLA                     |
| **Database RPO**            | <1 minute                                  | High     | Acceptable data loss            |
| **Recovery Time (RTO)**     | <5 minutes                                 | Critical | Max acceptable downtime         |

---

## 📊 Scale Requirements

### Daily/Hourly Load

- **Orders/Day**: 10M+ shipments
- **Peak Orders/Second**: 100K orders during peak (9-11 AM, 4-6 PM)
- **Concurrent Users**: 100K+ drivers, 500K+ customers simultaneously active
- **Concurrent Shipments In Transit**: 5M+
- **Notifications/Day**: 50M+

### Data Volume

- **Shipments/Year**: 3.65B orders (10M × 365 days)
- **Historical Orders**: 50B+ orders in database (5 years retention)
- **Location Updates/Day**: 2.5B+ (5M shipments × 1 update every 5 sec × 8 hours)
- **Database Size**: ~500TB+ (accounting for indexes, replicas)

### Geographic Scale

- **Coverage**: 100+ cities across multiple countries
- **Warehouses/Hubs**: 1000+ distribution centers
- **Regional Servers**: Multi-region deployment (US, EU, Asia)
- **Timezone Handling**: 24/7 operations across timezones

---

## 🏗️ Design Constraints & Decisions

### Technology Stack (Spring Boot/Java)

- **Language**: Java 17+ with strong typing and generics
- **Framework**: Spring Boot 3.1.5+ with Spring Data JPA
- **Database**: PostgreSQL (primary) with Read Replicas
- **Search**: Elasticsearch for order history and analytics
- **Message Queue**: Apache Kafka for event streaming
- **Cache**: Redis for driver locations, routes, sessions
- **Geospatial**: PostGIS PostgreSQL extension for location queries
- **Deployment**: Kubernetes with Docker containers
- **Build**: Maven for dependency management and build
- **Testing**: JUnit 5, Mockito for unit/integration tests
- **Documentation**: Springdoc OpenAPI with Swagger UI

### Key Architectural Decisions

1. **Microservices Evolution**: Start modular monolith → evolve to microservices
2. **Event-Driven Architecture**: Kafka topics for order events, shipment events, payment events
3. **CQRS Pattern**: Separate command (write) from query (read) models
4. **Layered Architecture**: Controller → Service → Repository → Database
5. **Transaction Management**: @Transactional boundaries with explicit isolation levels
6. **Caching Strategy**: Redis for hot data (active shipments, driver locations)
7. **Spring Cloud**: Service discovery, config server, API gateway

### Compliance & Security

- PCI-DSS for payment processing
- GDPR compliance for customer data (EU operations)
- Encryption at rest and in transit (TLS 1.3)
- Spring Security with OAuth 2.0 for authentication
- Audit logging via @Aspect for all financial transactions
- Rate limiting via Spring Cloud Gateway

---

## 🔍 Critical Design Questions

### 1. Database Architecture with Spring Data JPA

```java
Q: How do you shard 50B orders across multiple databases?
A: Use database routing via AbstractRoutingDataSource.
   Shard by region_id (US-East, EU, Asia).
   Each region has primary DB + read replicas.
   Spring Data JPA @Repository interfaces work transparently.

Q: How to efficiently query "all orders for customer"?
A: @Query("SELECT s FROM Shipment s WHERE s.customerId = ?1 ORDER BY s.createdAt DESC")
   Index on (customer_id, created_at).
   Use @Query with custom SQL for complex queries.
   Cache frequent results in Redis.

Q: Handling concurrent updates to shipment status?
A: Use @Version (optimistic locking) on Shipment entity.
   Status state transitions validated in @Service layer.
   Conflicts rare because status transitions are unidirectional.
```

### 2. Real-Time Tracking at Scale

```java
Q: How to ingest 2.5B location updates/day (28.9K/sec)?
A: Kafka consumer group processes events asynchronously.
   DriverLocationService receives events, updates Redis immediately.
   Batch persist to PostgreSQL every 30 seconds using @Async.
   Eventual consistency model for database reads.

Q: Making location data searchable?
A: PostGIS queries: "SELECT * FROM driver_locations
   WHERE ST_DWithin(location, point, 5000)" // 5km radius
   Cache frequent searches in Redis.
   Use Spring Data JPA @Query with PostGIS functions.

Q: Reducing latency for "driver on map" feature?
A: Spring WebSocket @MessageMapping for real-time updates.
   Driver app maintains persistent WebSocket connection.
   Location: Driver → Redis (L1, <10ms) → WebSocket broadcast.
   Sync to PostgreSQL asynchronously in background.
```

### 3. Route Optimization Under Constraints

```java
Q: Algorithm for TSP with 1000 stops in <5 seconds?
A: Genetic algorithm using ExecutorService for parallelization.
   Pre-compute distance matrix and cache in Redis.
   Local search (2-opt improvements) on best solution found.
   Hybrid approach: Greedy first (O(n)) + GA refinement (O(n²)).

Q: How to handle constraints (time windows, capacity)?
A: Use constraint satisfaction modeling:
   - Hard constraints: Vehicle capacity must be >= total weight
   - Soft constraints: Time window penalties (1 min late = +1 cost unit)
   Implement in RouteOptimizationService with validation.

Q: Caching route solutions?
A: RouteCache with cache key = hash(stops, vehicle, constraints).
   Cache TTL: 1 hour. Invalidate if traffic layer changes.
   Use @Cacheable(value="routes", key="...") annotation.
```

### 4. Exactly-Once Payment Processing with Transactions

```java
Q: How to ensure no duplicate charges?
A: Idempotency keys: Client generates UUID for payment.
   @Table unique constraint: (payment_id, idempotency_key).
   PaymentService.charge() checks constraint before creating Payment entity.

Q: Recovering from partial failures?
A: Saga pattern with @Transactional boundaries:
   Step 1: Create Payment record (status=PENDING)
   Step 2: Call stripe API (idempotent)
   Step 3: Update Shipment.paymentId
   If step 3 fails, retry (idempotency key prevents duplicate charge).
   Compensating transaction only if unrecoverable error.

Q: Reconciliation with payment gateway?
A: @Scheduled(fixedDelay = "1 hour") reconciliation job.
   Compare local PaymentRepository vs. Stripe API.
   Alert on discrepancies via @Scheduled task + alerting service.
   Manual review for >$10K discrepancies.
```

### 5. Consistency & Reliability

```java
Q: Handling out-of-order location updates?
A: DriverLocationEntity.lastUpdateTime field.
   Only accept updates if event.timestamp > entity.lastUpdateTime.
   Buffer delayed updates (queue in Redis for 5 minutes).
   Discard if older than 5 minutes.

Q: Atomic updates across services?
A: Event sourcing: ShipmentStatusChangedEvent published to Kafka.
   Other services consume events from Kafka topics.
   Single source of truth: ShipmentEventStore (immutable log).
   Current state rebuilt by replaying events.

Q: Recovering from Kafka failure?
A: Kafka Consumer group with Dead Letter Topic (DLT).
   Failed messages published to ${topic}-DLT topic.
   Separate consumer monitors DLT, alerts ops team.
   Replay DLT messages after issue resolved.
```

---

## 📈 Scalability & Performance Strategy

### Spring Boot Configuration for Scale

```properties
# Connection Pooling (HikariCP)
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=10000

# JPA Batch Settings
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Cache Configuration
spring.cache.type=redis
spring.redis.timeout=2000
spring.cache.redis.time-to-live=3600000
```

### Database Scaling Strategy

- **Sharding by Region**: @Configuration class routes requests by region
- **Read Replicas**: ReadOnly @Transactional(readOnly=true) routes to replicas
- **Connection Pooling**: HikariCP with 20 max connections per app instance
- **Partitioning**: Orders table partitioned by month in PostgreSQL
- **Indexing**: (region_id, created_at), (customer_id), (driver_id)

### Caching Strategy with Spring Cache

```java
@Service
public class DriverLocationService {
  @Cacheable(value = "driverLocations", key = "#driverId")
  public DriverLocation getDriverLocation(String driverId) {
    // L1 Cache (Redis, 5 sec TTL)
    return driverLocationRepository.findById(driverId);
  }

  @CacheEvict(value = "driverLocations", key = "#driverId")
  public void updateDriverLocation(String driverId, Location loc) {
    // Invalidate on update
    driverLocationRepository.save(new DriverLocation(driverId, loc));
  }
}
```

### Horizontal Scaling

- **API Servers**: Spring Boot instances scale by CPU/memory metrics
- **Route Optimizer**: Separate @Service beans in dedicated instances
- **Tracking Service**: WebSocket servers handle persistent connections
- **Payment Service**: Isolated deployment for PCI compliance
- **Kubernetes HPA**: Auto-scale based on request rate and latency

### Geographic Distribution

- **Active-Active Multi-Region**: Each region runs independent Spring Boot cluster
- **Global DNS (Route 53)**: Route customer to nearest region
- **Kafka Mirror Cluster**: Replicate topics across regions
- **Data Sync**: Eventual consistency via Kafka topics
- **Failover**: If primary region down, failover to secondary (increased latency acceptable)

---

## 🚨 Failure Scenarios & Resilience

### Scenario 1: Driver Goes Offline Mid-Delivery

```java
Problem: Driver loses connectivity with 500 stops planned
Solution:
- Driver mobile app caches last received route
- App continues offline with last known route
- On reconnection, mobile app syncs location + status updates
- Backend detects gap via lastSeenTimestamp > 5 minutes
- RouteOptimizationService re-optimizes if delay > SLA
- NotificationService alerts customer if delivery SLA at risk

Implementation:
@Service
public class DriverSyncService {
  @Transactional
  public void syncOfflineUpdates(String driverId, List<LocationUpdate> updates) {
    updates.forEach(update -> {
      if (update.timestamp > driver.lastSyncTime) {
        driverLocationRepository.save(...);
      }
    });
    if (driver.missedDeadline) {
      notificationService.alertCustomer(driver.assignedShipment);
    }
  }
}
```

### Scenario 2: Database Replica Lag (5 minutes behind)

```java
Problem: Customer sees stale tracking data
Solution:
- For critical reads (payment, delivery confirmation), query primary DB
- For tracking (non-critical), read from replica
- Show customer: "Last updated 5 minutes ago"
- Redis acts as source of truth for real-time tracking
- Fall back to primary DB if replica stale

Implementation:
@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, String> {
  @Query(nativeQuery = true, value = "SELECT * FROM shipments WHERE id = ?1")
  @Transactional(readOnly = true) // Routes to replica
  Shipment findByIdReadOnly(String id);

  // For critical reads, use primary explicitly
  @Query("SELECT s FROM Shipment s WHERE s.id = ?1")
  @Transactional(readOnly = false)
  Shipment findByIdFromPrimary(String id);
}
```

### Scenario 3: Route Optimization Service Timeout

```java
Problem: Calculating optimal route for 1000 stops takes >5 seconds
Solution:
- Set timeout at 4.5 seconds with ExecutorService.
- Return best solution found within timeout.
- Hybrid algorithm: greedy first (fast), then GA refinement.
- Cache similar problems and re-use solutions.
- Alert if timeout occurs frequently (algorithm needs optimization).

Implementation:
@Service
public class RouteOptimizationService {
  public RouteResponse optimizeRoute(RouteRequest request) throws TimeoutException {
    ExecutorService executor = Executors.newSingleThreadExecutor();
    Future<RouteResponse> future = executor.submit(() -> {
      // Greedy algorithm (O(n log n))
      RouteResponse best = greedyOptimize(request);
      // GA refinement (O(n²) in iterations)
      best = geneticAlgorithmOptimize(best, request);
      return best;
    });

    try {
      return future.get(4500, TimeUnit.MILLISECONDS); // 4.5 sec timeout
    } catch (TimeoutException e) {
      logger.warn("Route optimization timeout for {} stops", request.stops.size());
      return fallbackFastRoute(request);
    }
  }
}
```

### Scenario 4: Payment Gateway Down for 30 Minutes

```java
Problem: Cannot charge customers; orders queued
Solution:
- Queue payment in PaymentEntity with status=PENDING.
- Retry every 5 minutes with exponential backoff.
- Allow shipment to proceed (business requirement).
- Alert if >$100K payments pending after 1 hour.
- Manual escalation for resolution.

Implementation:
@Service
public class PaymentService {
  @Transactional
  public Payment processPayment(PaymentRequest request) {
    Payment payment = Payment.builder()
      .status(PaymentStatus.PENDING)
      .shipmentId(request.shipmentId)
      .amount(request.amount)
      .retryCount(0)
      .build();
    paymentRepository.save(payment);

    publishPaymentEvent("PAYMENT_QUEUED", payment);
    return payment;
  }

  @Scheduled(fixedDelay = 5 * 60 * 1000) // 5 min
  public void retryPendingPayments() {
    List<Payment> pending = paymentRepository.findByStatusAndRetryCountLessThan(
      PaymentStatus.PENDING, 24
    );
    pending.forEach(p -> {
      if (canRetryPayment(p)) {
        retryPaymentWithBackoff(p);
      }
    });

    List<Payment> critical = paymentRepository.findByStatusAndAmountGreaterThan(
      PaymentStatus.PENDING, 100000
    );
    if (critical.size() > 10) {
      alertingService.sendAlert("Critical: $" +
        critical.stream().map(p -> p.amount).reduce(0L, Long::sum) +
        " in pending payments");
    }
  }
}
```

### Scenario 5: Entire Region Lost Connectivity

```java
Problem: US-East region isolated for 10 minutes
Solution:
- Driver app works offline with cached routes
- Events queued locally in embedded H2 database
- On reconnection, sync all events to Kafka
- Use idempotency keys to prevent duplicate processing
- Monitor replication lag post-recovery

Implementation:
@Configuration
public class OfflineFirstConfig {
  @Bean
  public DataSource offlineDataSource() {
    // H2 in-memory for offline events
    return DataSourceBuilder.create()
      .driverClassName("org.h2.Driver")
      .url("jdbc:h2:mem:offlineQueue")
      .build();
  }

  @Service
  public class OfflineEventQueue {
    @Async
    public void enqueueEvent(LogisticsEvent event) {
      offlineRepository.save(event); // Local H2
    }

    @Scheduled(fixedDelay = 10000) // Retry every 10s
    public void syncOnlineEvents() {
      List<LogisticsEvent> queued = offlineRepository.findAll();
      queued.forEach(event -> {
        kafkaTemplate.send("events-topic", event.getIdempotencyKey(), event);
      });
    }
  }
}
```

### Scenario 6: Surge - 10x Normal Traffic (500K orders/sec)

```java
Problem: System receives 10x normal traffic suddenly
Solution:
- Rate limit API to 50K orders/sec per region via Spring Cloud Gateway.
- Reject overflow with HTTP 429 "Too Many Requests".
- Queue rejected orders with TTL for retry.
- Trigger auto-scaling (bring 10 new instances in 5 minutes).
- Prioritize critical operations (payments > tracking updates).

Implementation:
@Configuration
public class RateLimitingConfig {
  @Bean
  public RouteLocator customRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
      .route("shipments", r -> r
        .path("/api/v1/shipments/**")
        .filters(f -> f.requestRateLimiter(config -> config
          .setRateLimiter(redisRateLimiter())
          .setKeyResolver(userKeyResolver())))
        .uri("lb://shipment-service"))
      .build();
  }

  @Bean
  public RedisRateLimiter redisRateLimiter() {
    return new RedisRateLimiter(50000, 50000); // 50K req/sec
  }
}

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(RequestNotPermitted.class)
  public ResponseEntity<ErrorResponse> handleRateLimiting() {
    return ResponseEntity.status(429)
      .body(new ErrorResponse("Service overloaded. Please retry in a few seconds."));
  }
}
```

---

## 🔗 API & Service Contracts

### Core APIs (Spring Boot/Java)

#### Shipment Service

```java
@RestController
@RequestMapping("/api/v1/shipments")
public class ShipmentController {

  // Create shipments
  @PostMapping
  public ResponseEntity<CreateShipmentResponse> createShipments(
    @Valid @RequestBody CreateShipmentRequest request) {
    List<Shipment> created = shipmentService.createShipments(request.shipments);
    return ResponseEntity.status(201).body(new CreateShipmentResponse(created));
  }

  // Get shipment status
  @GetMapping("/{shipmentId}")
  public ResponseEntity<ShipmentResponse> getShipment(
    @PathVariable String shipmentId) {
    Shipment shipment = shipmentService.getShipment(shipmentId);
    return ResponseEntity.ok(ShipmentResponse.fromEntity(shipment));
  }

  // Update shipment (driver marks delivered)
  @PatchMapping("/{shipmentId}")
  @Transactional
  public ResponseEntity<ShipmentResponse> updateShipment(
    @PathVariable String shipmentId,
    @Valid @RequestBody UpdateShipmentRequest request) {
    Shipment updated = shipmentService.updateShipment(shipmentId, request);
    return ResponseEntity.ok(ShipmentResponse.fromEntity(updated));
  }
}
```

#### Driver Service

```java
@RestController
@RequestMapping("/api/v1/drivers/{driverId}")
public class DriverController {

  // Accept assignment
  @PostMapping("/accept")
  @Transactional
  public ResponseEntity<AssignmentResponse> acceptShipment(
    @PathVariable String driverId,
    @Valid @RequestBody AcceptShipmentRequest request) {
    Assignment assignment = driverService.acceptShipment(driverId, request);
    return ResponseEntity.ok(AssignmentResponse.fromEntity(assignment));
  }

  // Update location (high frequency)
  @PostMapping("/location")
  public ResponseEntity<Void> updateLocation(
    @PathVariable String driverId,
    @Valid @RequestBody LocationUpdateRequest request) {
    driverLocationService.updateLocation(driverId, request);
    return ResponseEntity.noContent().build();
  }

  // Complete delivery
  @PostMapping("/complete")
  @Transactional
  public ResponseEntity<DeliveryConfirmation> completeDelivery(
    @PathVariable String driverId,
    @Valid @RequestBody CompleteDeliveryRequest request) {
    DeliveryConfirmation confirmation = driverService.completeDelivery(
      driverId, request);
    return ResponseEntity.ok(confirmation);
  }
}
```

#### Tracking Service (WebSocket)

```java
@Configuration
@EnableWebSocket
public class TrackingWebSocketConfig implements WebSocketConfigurer {
  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(trackingWebSocketHandler(), "/tracking/{shipmentId}");
  }
}

@Service
public class TrackingWebSocketHandler extends AbstractWebSocketMessageHandler {
  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) {
    String shipmentId = getShipmentIdFromSession(session);
    // Send real-time updates: driver location, ETA, status events
    sendTrackingUpdate(session, shipmentId);
  }

  @Async
  public void broadcastLocationUpdate(String shipmentId, LocationUpdate update) {
    // Broadcast to all connected clients tracking this shipment
    sessions.get(shipmentId).forEach(session ->
      sendMessage(session, update));
  }
}
```

#### Route Optimization

```java
@RestController
@RequestMapping("/api/v1/routes")
public class RouteController {

  @PostMapping("/optimize")
  public ResponseEntity<RouteResponse> optimizeRoute(
    @Valid @RequestBody RouteRequest request) {
    RouteResponse response = routeOptimizationService.optimize(request);
    return ResponseEntity.ok(response);
  }
}

@Service
public class RouteOptimizationService {
  public RouteResponse optimize(RouteRequest request) {
    // Validate input
    validateRouteRequest(request);

    // Check cache
    String cacheKey = generateCacheKey(request);
    RouteResponse cached = routeCache.getIfPresent(cacheKey);
    if (cached != null) return cached;

    // Optimize with timeout
    RouteResponse optimal = optimizeWithTimeout(request, 4500);

    // Cache result
    routeCache.put(cacheKey, optimal);

    return optimal;
  }
}
```

#### Payment Service

```java
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

  @PostMapping
  @Transactional
  public ResponseEntity<PaymentResponse> processPayment(
    @Valid @RequestBody PaymentRequest request) {
    Payment payment = paymentService.processPayment(request);
    return ResponseEntity.status(201).body(PaymentResponse.fromEntity(payment));
  }

  @GetMapping("/{paymentId}")
  public ResponseEntity<PaymentResponse> getPaymentStatus(
    @PathVariable String paymentId) {
    Payment payment = paymentService.getPayment(paymentId);
    return ResponseEntity.ok(PaymentResponse.fromEntity(payment));
  }
}

@Service
public class PaymentService {
  @Transactional
  public Payment processPayment(PaymentRequest request) {
    // Check idempotency
    Payment existing = paymentRepository.findByIdempotencyKey(
      request.idempotencyKey);
    if (existing != null) return existing; // Exactly-once

    // Create payment record
    Payment payment = Payment.builder()
      .shipmentId(request.shipmentId)
      .amount(request.amount)
      .idempotencyKey(request.idempotencyKey)
      .status(PaymentStatus.PROCESSING)
      .build();
    payment = paymentRepository.save(payment);

    // Process with payment gateway
    try {
      StripeResponse response = stripeClient.charge(request);
      payment.setStatus(PaymentStatus.SUCCESS);
      payment.setTransactionId(response.transactionId);
    } catch (Exception e) {
      payment.setStatus(PaymentStatus.PENDING); // Queue for retry
      logger.error("Payment processing failed", e);
    }

    return paymentRepository.save(payment);
  }
}
```

---

## 📊 Monitoring & Observability

### Spring Boot Actuator Configuration

```properties
# Actuator endpoints
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.metrics.distribution.percentiles-histogram.http.server.requests=true
management.health.livenessState.enabled=true
management.health.readinessState.enabled=true

# Custom metrics
management.metrics.tags.application=logistics-service
management.metrics.tags.region=us-east-1
```

### Key Metrics

```java
@Service
public class MetricsService {
  private final MeterRegistry meterRegistry;

  public void recordOrderCreation(long durationMs) {
    meterRegistry.timer("orders.created").record(durationMs, TimeUnit.MILLISECONDS);
  }

  public void recordRouteOptimization(long durationMs, int stopCount) {
    meterRegistry.timer("route.optimization.duration")
      .record(durationMs, TimeUnit.MILLISECONDS);
    meterRegistry.gauge("route.optimization.stops", stopCount);
  }

  public void recordPaymentSuccess() {
    meterRegistry.counter("payments.success").increment();
  }

  public void recordPaymentFailure() {
    meterRegistry.counter("payments.failed").increment();
  }
}

Application Metrics:
- orders.created: Timer for order creation latency
- route.optimization.duration: Timer for route calculation
- payments.success/failed: Counters for payment outcomes
- driver.utilization: Gauge for active drivers

Infrastructure Metrics (via Prometheus):
- jvm.memory.used: JVM memory usage
- process.cpu.usage: CPU utilization
- http.server.requests: HTTP latency histogram
- db.connection.pool: Database pool metrics

Business Metrics:
- On-time delivery rate %
- Driver acceptance rate %
- Customer satisfaction score
```

### Alerting Rules (Spring Cloud Config)

```yaml
alerts:
  critical:
    - name: SystemUptime
      condition: uptime < 99.99%
      action: PAGE_ONCALL

    - name: PaymentFailureRate
      condition: payments.failed / (payments.success + payments.failed) > 1%
      action: PAGE_ONCALL + SMS

    - name: DatabaseReplicationLag
      condition: replication_lag_seconds > 300
      action: PAGE_ONCALL

  high:
    - name: APILatencyP95
      condition: http.server.requests_p95 > 500ms
      action: ALERT_SLACK

    - name: RouteOptimizationTimeout
      condition: route.optimization.timeout_count > 10/hour
      action: ALERT_SLACK
```

---

## 🎯 Implementation Roadmap

### Phase 1: MVP (Weeks 1-8) - Spring Boot Monolith

- ✅ Order creation & status tracking (@Entity + @Repository)
- ✅ Basic route optimization (greedy algorithm)
- ✅ Driver assignment (simple matching rules)
- ✅ Payment processing (Stripe integration via @RestTemplate)
- ✅ Push notifications (Firebase Cloud Messaging)
- **Scale Target**: 100K orders/day
- **Deployment**: Single Spring Boot instance + PostgreSQL

### Phase 2: Enhancement (Weeks 9-16)

- ✅ Real-time tracking (Spring WebSocket + Redis)
- ✅ Advanced route optimization (genetic algorithm)
- ✅ Dynamic pricing (@Service with market analysis)
- ✅ Analytics dashboard (Elasticsearch aggregations)
- ✅ Admin portal (Spring Security + Thymeleaf/React)
- **Scale Target**: 1M orders/day
- **Deployment**: Multi-instance with Nginx load balancing

### Phase 3: Scale & Microservices (Weeks 17-24)

- ✅ Multi-region deployment (Spring Cloud Config Server)
- ✅ Database sharding (AbstractRoutingDataSource)
- ✅ Kafka for event streaming (@KafkaListener)
- ✅ Service decomposition (ShipmentService, DriverService, PaymentService)
- ✅ ML-based demand forecasting (separate service)
- **Scale Target**: 10M+ orders/day
- **Deployment**: Kubernetes with service mesh (Istio)

---

## ✅ Success Criteria

- ✅ System handles 500K req/sec sustained for 2 hours
- ✅ 99.99% of orders assigned driver within 5 minutes
- ✅ Route calculation for 1000 stops completes in <5 seconds
- ✅ Survives single service/database node failure (<5 min recovery)
- ✅ All customer-facing APIs respond <200ms (p95)
- ✅ Zero duplicate payments (exactly-once with idempotency keys)
- ✅ Real-time tracking updates reach customer within 10 seconds
- ✅ 98%+ on-time delivery rate
- ✅ System cost <$0.50 per shipment
- ✅ 99.99% payment success rate after retry mechanism

---

## 📚 Reference Materials

Use the Spring Boot Low-Level Design Skill for:

- **Design Patterns Guide**: Factory (@Bean creation), Strategy (pricing algorithms), Observer (event listeners)
- **SOLID Principles**: Dependency Inversion using Spring @Autowired, Liskov via interface contracts
- **Service Architecture**: Layered design (Controller → Service → Repository)
- **Error Handling**: Custom exception hierarchy with @ControllerAdvice
- **Transaction Management**: @Transactional with isolation levels
- **Caching**: @Cacheable/@CacheEvict with Spring Cache abstraction
- **Async Processing**: @Async/@Scheduled for background tasks
- **Testing**: MockMvc for controller tests, @DataJpaTest for repositories

Location: `/claude-skills/springboot-java/low-level-design-skill/`

**Key Classes to Review**:

- `springboot-service-template.java` - Full service architecture template
- `design-patterns-examples.java` - Production patterns with validation
- `application.properties` - Configuration for scale

---

**Created**: June 2026
**Version**: 1.0
**Tech Stack**: Spring Boot 3.1.5 + Java 17 + PostgreSQL + Kafka + Redis
**Status**: Ready for System Design Interview / Production Implementation
