# UML Diagrams for Design Visualization

## Class Diagrams

**Purpose:** Show structure of classes and their relationships.

**Elements:**
- **Class:** Rectangle with class name, attributes, methods
- **Inheritance:** Solid line with unfilled triangle (parent → child)
- **Implementation:** Dashed line with unfilled triangle (interface → implementation)
- **Association:** Solid line connecting classes
- **Aggregation:** Solid line with unfilled diamond
- **Composition:** Solid line with filled diamond
- **Dependency:** Dashed line with arrow

**Example:**
```
┌─────────────────────────┐
│         Animal          │
├─────────────────────────┤
│ - name: string          │
│ - age: number           │
├─────────────────────────┤
│ + speak(): void         │
│ + sleep(): void         │
└────────────┬────────────┘
             │ inherits
             │
    ┌────────┴────────┐
    │                 │
┌───────┐         ┌────────┐
│ Dog   │         │ Cat    │
├───────┤         ├────────┤
│       │         │        │
├───────┤         ├────────┤
│fetch()│         │scratch()│
└───────┘         └────────┘
```

**When to Use:**
- Planning class structure
- Showing relationships
- Communicating architecture

---

## Sequence Diagrams

**Purpose:** Show interactions between objects over time.

**Elements:**
- **Objects:** Top boxes
- **Lifelines:** Dashed vertical lines
- **Messages:** Arrows between lifelines
- **Activation boxes:** Small rectangles on lifelines

**Example - User Registration Flow:**
```
User           Controller         Service          Repository
 │                  │                │                  │
 │ POST /register   │                │                  │
 ├─────────────────>│                │                  │
 │                  │ register()     │                  │
 │                  ├───────────────>│                  │
 │                  │                │ save(user)       │
 │                  │                ├─────────────────>│
 │                  │                │                  │ save to DB
 │                  │                │<─ user saved ────┤
 │                  │<─ return User ─┤                  │
 │<─ 201 Created ───┤                │                  │
 │                  │                │                  │
```

**When to Use:**
- Showing interactions between classes
- Illustrating workflows
- Debugging message flows

---

## State Diagrams

**Purpose:** Show states and transitions.

**Elements:**
- **States:** Rounded rectangles
- **Transitions:** Arrows with triggers
- **Initial state:** Filled circle
- **Final state:** Filled circle with ring

**Example - Order State Machine:**
```
        ┌─────────────┐
        │   START     │
        └──────┬──────┘
               │ create order
               ↓
        ┌─────────────┐
        │  PENDING    │
        └──────┬──────┘
               │ confirm payment
               ↓
        ┌─────────────┐
        │ PROCESSING  │
        └──────┬──────┘
               │ ship
               ↓
        ┌─────────────┐
        │  SHIPPED    │
        └──────┬──────┘
               │ deliver
               ↓
        ┌─────────────┐
        │DELIVERED    │
        └──────┬──────┘
               │ complete
               ↓
        ┌─────────────┐
        │   END       │
        └─────────────┘
```

**When to Use:**
- Modeling object lifecycle
- Showing state transitions
- Validating workflows

---

## Use Case Diagrams

**Purpose:** Show system functionality from user perspective.

**Elements:**
- **Actors:** Stick figures
- **Use Cases:** Ovals
- **System Boundary:** Rectangle
- **Relationships:** Lines

**Example - E-commerce System:**
```
                    ┌───────────────────────────┐
                    │   E-Commerce System       │
                    │                           │
    ┌─────────┐     │  ┌──────────────────┐     │
    │ Customer│────>│  │  Browse Products │     │
    └─────────┘     │  └──────────────────┘     │
         │          │                           │
         │          │  ┌──────────────────┐     │
         ├─────────>│  │  Add to Cart     │     │
         │          │  └──────────────────┘     │
         │          │                           │
         │          │  ┌──────────────────┐     │
         ├─────────>│  │  Checkout        │     │
         │          │  └──────────────────┘     │
         │          │                           │
         │          │  ┌──────────────────┐     │
         └─────────>│  │  Place Order     │     │
                    │  └──────────────────┘     │
                    │                           │
    ┌──────────┐    │  ┌──────────────────┐     │
    │ Admin    │───>│  │  Manage Orders   │     │
    └──────────┘    │  └──────────────────┘     │
                    │                           │
                    └───────────────────────────┘
```

**When to Use:**
- Requirements gathering
- Showing user interactions
- Planning features

---

## Component Diagrams

**Purpose:** Show physical organization of components.

**Elements:**
- **Components:** Rectangles with icon
- **Interfaces:** Circles with label
- **Dependencies:** Dashed lines
- **Packages:** Large rectangles

**Example - E-commerce Architecture:**
```
┌─────────────────────────────────────────────────┐
│               User Interface                    │
└───────────┬───────────────────────────────────┬─┘
            │                                   │
     ┌──────▼──────┐                     ┌──────▼──────┐
     │Web Component│                     │ Mobile App  │
     └──────┬──────┘                     └──────┬──────┘
            │                                   │
            └─────────────────┬─────────────────┘
                              │
         ┌────────────────────▼──────────────────┐
         │     REST API Layer                    │
         └────────────────────┬──────────────────┘
                              │
         ┌────────────────────▼──────────────────┐
         │     Business Logic Services           │
         │ ┌──────────┐  ┌──────────┐            │
         │ │ User Svc │  │ Order Svc│            │
         │ └──────────┘  └──────────┘            │
         └────────────────────┬──────────────────┘
                              │
         ┌────────────────────▼──────────────────┐
         │     Data Access Layer                 │
         │ ┌──────────┐  ┌──────────┐            │
         │ │UserDAO   │  │OrderDAO  │            │
         │ └──────────┘  └──────────┘            │
         └────────────────────┬──────────────────┘
                              │
         ┌────────────────────▼────────────────┐
         │     Database                        │
         └─────────────────────────────────────┘
```

**When to Use:**
- Showing system architecture
- Planning deployment
- Component dependencies

---

## Activity Diagrams

**Purpose:** Show workflow and process flow.

**Elements:**
- **Activities:** Rounded rectangles
- **Transitions:** Arrows
- **Decision:** Diamond
- **Synchronization:** Thick line

**Example - User Registration Process:**
```
        START
          │
          ▼
    ┌─────────────┐
    │ Enter Email │
    └──────┬──────┘
           │
           ▼
    ◇─────────────◇
   /  Email Valid? \
  ╱                 ╲
 NO                 YES
  ╲                 ╱
   ◇               ◇
   │               │
   │      ┌────────▼───────┐
   │      │ Hash Password  │
   │      └────────┬───────┘
   │               │
   │      ┌────────▼───────┐
   │      │ Save to DB     │
   │      └────────┬───────┘
   │               │
   ▼               ▼
  ┌──────────────────────┐
  │  Show Error/Success  │
  └──────────┬───────────┘
             │
             ▼
            END
```

**When to Use:**
- Modeling business processes
- Showing decision logic
- Workflow documentation

---

## Deployment Diagrams

**Purpose:** Show hardware/software deployment.

**Elements:**
- **Nodes:** 3D boxes
- **Artifacts:** Files/components
- **Connections:** Lines

**Example - Web Application Deployment:**
```
┌───────────────────────────────────────────────────────────┐
│                    Client Network                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Web Browser                                        │  │
│  │  ├── React Application                              │  │
│  │  └── JavaScript Bundle                              │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────┬───────────────────────────────────── ┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────┐         ┌───────▼──────┐
│ Load         │         │ Load         │
│ Balancer     │         │ Balancer     │
└───────┬──────┘         └───────┬──────┘
        │                        │
   ┌────┴────┐             ┌────┴────┐
   │         │             │         │
┌──▼─┐    ┌──▼─┐         ┌──▼─┐   ┌──▼─┐
│App │    │App │         │App │   │App │
│Srv1│    │Srv2│         │Srv3│   │Srv4│
└──┬─┘    └──┬─┘         └──┬─┘   └──┬─┘
   │         │              │        │
   └─────────┼──────────────┼────────┘
             │              │
        ┌────▼──────────────▼──┐
        │   Database Cluster   │
        │  (Master-Slave Rep)  │
        └──────────────────────┘
```

**When to Use:**
- Infrastructure planning
- Showing deployment topology
- Physical architecture

---

## Tips for Effective UML Diagrams

1. **Keep it Simple:** Show only relevant details
2. **Be Consistent:** Use standard notation
3. **Add Labels:** Explain relationships clearly
4. **Use Color:** Highlight different aspects
5. **Document:** Explain purpose and assumptions

## When to Create Different Diagrams

| Diagram | Purpose | Audience |
|---------|---------|----------|
| **Class** | Structure and relationships | Developers |
| **Sequence** | Object interactions | Developers, Testers |
| **State** | Behavior and transitions | Business Analysts, Developers |
| **Use Case** | System requirements | Business Analysts, Stakeholders |
| **Component** | Architecture | Architects, DevOps |
| **Activity** | Process flows | Business Analysts |
| **Deployment** | System deployment | DevOps, Infrastructure |

Effective use of UML diagrams aids communication, design validation, and documentation.
