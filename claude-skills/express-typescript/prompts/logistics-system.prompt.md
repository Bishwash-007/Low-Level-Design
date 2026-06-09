# System Design Prompt: Robust Large-Scale Logistics Service

You are a system design expert helping build a large-scale logistics platform. Use the Express-TypeScript skill from `/claude-skills/express-typescript/low-level-design-skill/` to guide your design decisions.

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

### Technology Stack (Express-TypeScript)

- **Runtime**: Node.js for real-time capabilities, async I/O
- **Framework**: Express.js with TypeScript for type safety
- **Database**: PostgreSQL (primary), Redis (cache/real-time)
- **Message Queue**: Kafka for event streaming and async operations
- **Search**: Elasticsearch for order history search
- **Cache**: Redis for driver locations, popular routes
- **Geospatial**: PostGIS extension for location queries
- **Deployment**: Kubernetes for orchestration

### Key Architectural Decisions

1. **Microservices vs. Monolith**: Start monolith → evolve to services
2. **Event-Driven**: Kafka for asynchronous order processing, payments
3. **CQRS**: Separate read model for tracking from write model for orders
4. **Database Sharding**: By region/geography for scalability
5. **Cache Strategy**: Redis for hot data (active shipments, driver locations)

### Compliance & Security

- PCI-DSS for payment processing
- GDPR for customer data (EU operations)
- Encryption at rest and in transit
- Rate limiting and DDoS protection
- Audit logging for all financial transactions

---

## 🔍 Critical Design Questions

### 1. Database Architecture

```
Q: How do you shard 50B orders across multiple databases?
A: Shard by region/country, then by customer_id or shipment_date.
   Each region has primary + replica. Read-replicas for analytics.

Q: How to efficiently query "all orders for customer"?
A: Index on (customer_id, created_at). Partition by customer.
   Cache frequently accessed customers in Redis.

Q: Handling concurrent updates to shipment status?
A: Optimistic locking with version numbers. Conflicts rare.
   Status transitions validated: PENDING → CONFIRMED only.
```

### 2. Real-Time Tracking at Scale

```
Q: How to ingest 2.5B location updates/day (28.9K/sec)?
A: Batch updates to Kafka. Consumer writes to Redis first (fast),
   then PostgreSQL in bulk (async). Eventual consistency OK.

Q: Making location data searchable?
A: Use PostGIS for "find all drivers within 5km of customer".
   Cache frequently searched regions in Redis.

Q: How to reduce latency for "driver on map" feature?
A: Real-time WebSocket connection. Driver → Redis → WebSocket.
   Skip database, use cache. Sync to DB every 30 seconds.
```

### 3. Route Optimization Under Constraints

```
Q: Algorithm for TSP with 1000 stops in <5 seconds?
A: Genetic algorithm + local search (2-opt improvements).
   Cache pre-computed distances. Parallelize calculation.

Q: How to handle constraints (time windows, capacity)?
A: Constraint satisfaction problem. Penalty functions:
   - Hard: Cannot exceed vehicle capacity
   - Soft: Prefer delivering before time window (+2 minutes penalty)

Q: Caching route solutions?
A: Hash frequently requested stop combinations. TTL: 1 hour.
   Invalidate if traffic/congestion changes significantly.
```

### 4. Exactly-Once Payment Processing

```
Q: How to ensure no duplicate charges?
A: Idempotency keys. Client generates unique key for payment.
   Database unique constraint on (payment_id, idempotency_key).

Q: Recovering from partial failures?
A: Saga pattern. Create payment record → Charge customer → Update shipment.
   If step 3 fails, retry step 3 (step 1-2 already done).
   Rollback only if unrecoverable error.

Q: Reconciliation with payment gateway?
A: Daily batch job compares local payments vs. gateway records.
   Alert on discrepancies. Manual review for >$10K.
```

### 5. Consistency & Reliability

```
Q: Handling out-of-order location updates?
A: Track timestamp. Only accept updates if timestamp > last known.
   Buffer for 5 minutes in case late delivery from mobile network.

Q: Atomic updates across services?
A: Event sourcing for shipment status. Single source of truth.
   Other services consume events from Kafka stream.

Q: Recovering from Kafka failure?
A: Dead Letter Queue (DLQ) for failed messages.
   Replay DLQ after recovery. Monitor DLQ size alerting.
```

---

## 📈 Scalability & Performance Strategy

### Database Scaling

- **Sharding**: By region_id (US-East, US-West, EU, Asia)
- **Connection Pooling**: PgBouncer for 10K+ concurrent connections
- **Read Replicas**: 3 replicas per shard for read-heavy analytics
- **Partitioning**: Orders table partitioned by month
- **Indexing**: On (region_id, created_at), (customer_id), (driver_id)

### Caching Strategy

```
L1 Cache (Redis - 5 sec TTL):
- Active driver locations: { driver_id: {lat, lng, updated_at} }
- Popular routes: { route_hash: {stops, distance, duration} }
- Customer preferences: { customer_id: {preferred_time, payment_method} }

L2 Cache (CDN - 1 hour TTL):
- Geographical zones/regions data
- Pricing rules (surge multipliers)
- City/area master data
```

### Horizontal Scaling

- **API Servers**: Scale by load (requests/sec)
- **Route Optimizer**: Scale by queue depth (pending optimizations)
- **Tracking Service**: Scale by concurrent shipments
- **Payment Service**: Dedicated nodes for payment (isolation)
- **Auto-scaling**: Target 60% CPU, 70% memory

### Geographic Distribution

- **Multi-Region Active-Active**: Each region handles own traffic
- **Global DNS**: Route customer to nearest region
- **Data Sync**: Kafka cross-region topics for global state
- **Failover**: If region down, traffic routed to next region (with higher latency)

---

## 🚨 Failure Scenarios & Resilience

### Scenario 1: Driver Goes Offline Mid-Delivery

```
Problem: Driver loses connectivity while 500 stops planned
Solution:
- Driver app continues with last known route (cached locally)
- Periodically attempts reconnection (exponential backoff)
- When back online, sync location + status updates
- System recalculates route if significant delay detected
- Alert customer if delivery expected to miss time window
```

### Scenario 2: Database Replica Lag

```
Problem: Customer sees stale tracking data (5 minutes behind)
Solution:
- For critical reads (payment, delivery), use primary DB
- For tracking (non-critical), read from replica
- Implement eventual consistency: warn customer "last updated 5 min ago"
- Use Redis as source of truth for real-time tracking
```

### Scenario 3: Route Optimization Service Timeout

```
Problem: 1000-stop route takes >5 seconds to calculate
Solution:
- Timeout at 4.5 seconds, return best solution found
- Hybrid algorithm: greedy first (O(n)), then GA improvements
- Cache previous solutions if problem similar
- Fallback to sub-optimal but fast algorithm
```

### Scenario 4: Payment Gateway Is Down

```
Problem: Cannot charge customer for shipment
Solution:
- Queue payment in database with status PENDING
- Retry every 5 minutes (exponential backoff, max 24 hours)
- Allow shipment to proceed if not urgent (SLA met)
- Manual intervention alert if >$100K pending
```

### Scenario 5: Entire Region Loses Connectivity

```
Problem: US-East region isolated for 10 minutes
Solution:
- Drivers continue working with cached data (roads, shipments)
- Queue all events locally (SQLite or in-memory)
- On reconnection, sync events to central Kafka
- Accept potential duplicate processing (idempotency keys)
```

### Scenario 6: Surge: 10x Normal Traffic

```
Problem: 500K orders/sec instead of 50K
Solution:
- Rate limit API at 50K orders/sec per region
- Reject overflow with HTTP 429 "Try again later"
- Queue rejected orders in Redis with TTL
- Retry with exponential backoff
- Auto-scale worker nodes (bring up 10x capacity in 5 min)
```

---

## 🔗 API & Service Contracts

### Core APIs (Express-TypeScript)

#### Order Service

```typescript
// Create shipment
POST /api/v1/shipments
{
  shipments: [
    {
      pickup: { address, lat, lng, time_window },
      delivery: { address, lat, lng, time_window },
      items: [ { weight_kg, volume_cm3, fragile, hazmat } ],
      customer_id,
      priority: 'standard' | 'urgent',
    }
  ]
}
Response: { shipment_ids: ['SHP-001', ...], assignments: [...] }

// Get shipment status
GET /api/v1/shipments/:shipment_id
Response: {
  status,
  driver_id,
  location,
  eta,
  proof_of_delivery,
  events: [ { timestamp, status, location } ]
}

// Update shipment status
PATCH /api/v1/shipments/:shipment_id
{ status, proof_of_delivery, feedback }
```

#### Driver Service

```typescript
// Accept shipment
POST /api/v1/drivers/:driver_id/accept
{ shipment_id, eta }

// Update location (high frequency)
POST /api/v1/drivers/:driver_id/location
{ lat, lng, timestamp, accuracy }

// Complete delivery
POST /api/v1/drivers/:driver_id/complete
{ shipment_id, proof: { photo, signature } }
```

#### Tracking Service

```typescript
// Real-time WebSocket
WS /tracking/:shipment_id
Message: { driver_location, eta, events }

// Historical tracking
GET /api/v1/shipments/:shipment_id/history
Response: [ { timestamp, lat, lng, status, event } ]
```

#### Route Optimization

```typescript
POST /api/v1/routes/optimize
{
  stops: [
    { lat, lng, service_time_sec, time_window: { start, end } }
  ],
  vehicle: { capacity_kg, max_stops },
  constraints: { max_duration_sec, max_distance_km }
}
Response: {
  route: [ stop_ids ],
  distance_km,
  duration_sec,
  total_cost_usd
}
```

#### Payment Service

```typescript
POST /api/v1/payments
{
  shipment_id,
  amount_usd,
  currency,
  payment_method: { type: 'card' | 'wallet', token },
  idempotency_key // For exactly-once semantics
}
Response: { payment_id, status, transaction_id }
```

---

## 📊 Monitoring & Observability

### Key Metrics

```
Application Metrics:
- Orders created/sec
- Average order processing time
- Route optimization latency (p50, p95, p99)
- Payment success rate
- Driver acceptance rate

Infrastructure Metrics:
- CPU, memory, disk usage per service
- Network throughput (Mbps)
- Database query latency
- Cache hit ratio

Business Metrics:
- On-time delivery rate %
- Customer satisfaction (NPS)
- Driver utilization %
- Cost per shipment
- Revenue per hour
```

### Alerting Rules

```
Critical:
- System uptime < 99.99% (trigger page)
- Payment failure rate > 1% (page + SMS)
- Database replication lag > 5 min (page)
- Route optimization timeout > 10% (alert)

High:
- API latency p95 > 500ms (alert)
- Cache hit ratio < 60% (alert)
- Driver acceptance rate < 70% (alert)
```

---

## 🎯 Design Approach

### Phase 1: MVP (Weeks 1-8)

- ✅ Order creation & status tracking
- ✅ Basic route optimization (greedy algorithm)
- ✅ Driver assignment (simple matching)
- ✅ Payment processing (stripe integration)
- ✅ Push notifications
- Scale: 100K orders/day

### Phase 2: Enhancement (Weeks 9-16)

- ✅ Real-time tracking (WebSocket + Redis)
- ✅ Advanced route optimization (genetic algorithm)
- ✅ Dynamic pricing (surge detection)
- ✅ Analytics dashboard
- Scale: 1M orders/day

### Phase 3: Scale (Weeks 17-24)

- ✅ Multi-region deployment
- ✅ Database sharding
- ✅ Kafka for event streaming
- ✅ ML-based demand forecasting
- Scale: 10M+ orders/day

---

## ✅ Success Criteria

- ✅ System handles 500K req/sec for 2 hours sustained
- ✅ 99.99% of orders assigned driver within 5 minutes
- ✅ Route calculation for 1000 stops completes in <5 seconds
- ✅ Survives single service/database node failure (<5 min recovery)
- ✅ All customer-facing APIs respond <200ms (p95)
- ✅ Zero duplicate payments (exactly-once guaranteed)
- ✅ Real-time tracking updates reach customer within 10 seconds
- ✅ 98%+ on-time delivery rate
- ✅ System cost < $0.50 per shipment

---

## 📚 Reference Materials

Use the Express-TypeScript Low-Level Design Skill for:

- **Design Patterns Guide**: Factory (notification channels), Strategy (pricing), Observer (tracking events)
- **SOLID Principles**: Dependency Inversion for payment/routing services
- **Service Architecture**: Layered design with controller → service → repository
- **Error Handling**: Custom exception hierarchy for domain-specific errors
- **Middleware**: Request logging, rate limiting, authentication

Location: `/claude-skills/express-typescript/low-level-design-skill/`

---

**Created**: June 2026
**Version**: 1.0
**Status**: Ready for System Design Interview / Implementation
