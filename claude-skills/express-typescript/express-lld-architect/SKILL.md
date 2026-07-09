---
name: express-lld-architect
description: >
  Expert low-level design (LLD) guidance for Express.js + TypeScript systems.
  Use this skill whenever the user is designing, architecting, or refactoring
  backend code — even if they don't use the words "design pattern" or "SOLID".
  Triggers include: "how should I structure this service", "I need a clean way
  to handle X", "refactor this code", "design a payment/notification/auth
  system", "what pattern fits here", "make this more testable/scalable",
  "implement repository/service/factory/observer/strategy/state/decorator/
  proxy/command/builder/adapter pattern", "dependency injection", "UML diagram",
  "class diagram", "OOP design", or any request to architect a new Express
  route, controller, service, or data-access layer. Always use this skill
  before writing non-trivial TypeScript backend code.
---

# Express LLD Architect

Comprehensive low-level design guidance for Express.js + TypeScript —
from pattern selection through production-ready implementation.

## Quick Navigation

| Task | Go to |
|------|-------|
| Pick a design pattern | [Pattern Selection](#pattern-selection) |
| Apply SOLID principles | [SOLID Quick Ref](#solid-quick-reference) |
| Scaffold a new service | `assets/express-service-template.ts` |
| See pattern code | `assets/design-patterns-examples.ts` |
| Deep-dive any pattern | `references/design-patterns-guide.md` |
| Deep-dive SOLID | `references/solid-principles-guide.md` |
| OOP fundamentals | `references/oops-concepts.md` |
| Draw a UML diagram | `references/uml-diagrams.md` |

---

## Workflow for Every Design Task

1. **Understand** — What behaviour must be implemented? What are the pain points?
2. **Select patterns** — Use the table below; pick the minimum that solve the problem.
3. **Apply SOLID** — Validate your design against all five principles.
4. **Implement** — Use the template and examples as starting points.
5. **Organise for Express** — Controllers → Services → Repositories.
6. **Document trade-offs** — Explain *why* each pattern was chosen.

---

## Pattern Selection

### Creational — *how objects are created*

| Pattern | Use when… |
|---------|-----------|
| **Factory** | Multiple concrete types behind one creation call (e.g. `NotificationFactory.create('email')`) |
| **Builder** | Many optional constructor params; fluent `.where().sort().take().build()` APIs |
| **Singleton** | Exactly one instance needed app-wide: logger, config, DB pool |
| **Abstract Factory** | Families of related objects that must stay consistent (e.g. UI themes, cloud providers) |
| **Prototype** | Cloning is cheaper than re-initialising from scratch |

### Structural — *how objects are composed*

| Pattern | Use when… |
|---------|-----------|
| **Adapter** | Third-party / legacy interface doesn't match yours |
| **Decorator** | Adding behaviour at runtime without subclassing (logging, caching, auth checks) |
| **Facade** | Hiding a complex subsystem behind a simple entry point |
| **Proxy** | Controlling access: lazy-load, cache, auth guard |
| **Composite** | Treating trees of objects uniformly |
| **Bridge** | Decoupling abstraction from implementation so both can vary independently |
| **Flyweight** | Many short-lived objects sharing immutable state (connection pools, cached configs) |

### Behavioural — *how objects communicate*

| Pattern | Use when… |
|---------|-----------|
| **Observer** | Multiple subscribers react to state changes (order placed → email + analytics + inventory) |
| **Strategy** | Swap algorithms at runtime: payment methods, pricing tiers, validation rules |
| **State** | Object behaviour varies by internal state: order workflow, document lifecycle |
| **Command** | Encapsulate requests as objects for queuing, undo/redo, or audit logs |
| **Chain of Responsibility** | Pass a request through a pipeline until one handler claims it (middleware, approval flows) |
| **Template Method** | Common algorithm skeleton; subclasses fill in the steps |
| **Iterator** | Traverse custom data structures without exposing internals |
| **Mediator** | Reduce coupling in many-to-many object graphs |
| **Visitor** | Add operations to a class hierarchy without modifying it |
| **Memento** | Capture and restore object state (undo/redo) |
| **Interpreter** | Parse and execute a mini-language: query builders, rule engines |

---

## SOLID Quick Reference

| Principle | One-liner | Common violation | Fix |
|-----------|-----------|-----------------|-----|
| **S**RP | One class, one reason to change | `UserController` also sends email and hashes passwords | Split into `UserController`, `EmailService`, `PasswordService` |
| **O**CP | Extend without modifying | `if (type === 'visa') … else if (type === 'paypal')` | Extract `PaymentStrategy` interface; add new class per method |
| **L**SP | Subtypes must honour their parent's contract | `Square` overrides `setWidth` to also change height | Use a shared `Shape` interface instead of `Square extends Rectangle` |
| **I**SP | Small, focused interfaces | `Worker` forces `RobotWorker` to implement `eat()` | Split into `Workable`, `Eatable`, `Sleepable` |
| **D**IP | Depend on abstractions, not concretions | `new MySQLDatabase()` inside `UserService` | Inject `Database` interface via constructor |

---

## Express.js Architecture

All services follow this layered structure — read details in `references/` if needed:

```
HTTP Layer      (Routes, Controllers)   — thin; only HTTP concerns
    ↓
Service Layer   (Business Logic)        — pure TypeScript; no Express imports
    ↓
Repository Layer (Data Access)          — one interface, swap DB freely
```

**Key conventions:**
- Controllers use `asyncHandler` wrapper — never raw `try/catch` per route.
- Custom error classes (`ValidationError`, `NotFoundError`, …) flow to a single `errorHandler` middleware.
- Use a `DIContainer` to wire repositories → services → controllers at startup.
- DTOs shape requests in; `UserResponseDTO` shapes responses out.

---

## Reference Files

Read these on demand — don't load all at once:

- **`references/design-patterns-guide.md`** — Full TypeScript examples for every pattern listed above; includes Benefits / When-to-Use / Drawbacks for each.
- **`references/solid-principles-guide.md`** — Before/after code for every SOLID violation; combined SOLID example at the end.
- **`references/oops-concepts.md`** — Abstraction, encapsulation, inheritance, polymorphism, composition vs. inheritance, association/aggregation/composition.
- **`references/uml-diagrams.md`** — ASCII examples of class, sequence, state, use-case, component, activity, and deployment diagrams; when to use each.

## Asset Files

Use these as copy-paste starting points:

- **`assets/express-service-template.ts`** — Production-ready scaffold: DIContainer, Repository, Service, Controller, DTOs, custom errors, middleware stack, graceful shutdown.
- **`assets/design-patterns-examples.ts`** — Runnable TypeScript implementations of Factory, Builder, Strategy, Decorator, Observer, State, Adapter, Proxy, and Command patterns — all with validation and error handling.
