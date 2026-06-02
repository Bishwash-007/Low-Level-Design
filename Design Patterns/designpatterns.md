# Design Patterns in Low-Level System Design

## Overview

Design patterns are reusable solutions to common problems in software design. In low-level system design (LLD), they help create maintainable, scalable, and robust code. There are 23 classic Gang of Four (GoF) design patterns divided into three categories.

---

## 1. Creational Patterns

Creational patterns focus on object creation mechanisms. They abstract the instantiation process to make systems independent of how their objects are composed and represented.

### 1.1 Singleton Pattern

**Definition**: Ensures a class has only one instance and provides a global point of access to it.

**Use Cases**:
- Database connections
- Logger classes
- Configuration managers
- Thread pools
- Cache managers

**Implementation**:
```typescript
class Singleton {
    private static instance: Singleton;
    
    private constructor() {}
    
    public static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}
```

**Thread-Safe Version (Eager Loading)**:
```typescript
class Singleton {
    private static readonly instance: Singleton = new Singleton();
    
    private constructor() {}
    
    public static getInstance(): Singleton {
        return Singleton.instance;
    }
}
```

**Pros**:
- Controlled access to shared resource
- Lazy initialization possible
- Thread-safe implementation available

**Cons**:
- Difficult to test (hard to mock)
- Hides dependencies
- Can mask design issues

---

### 1.2 Factory Pattern

**Definition**: Creates objects without specifying the exact classes to create. Uses a factory method to instantiate objects.

**Use Cases**:
- Creating different types of database connections
- UI component creation based on OS
- Payment processing systems
- Vehicle manufacturing systems

**Implementation**:
```typescript
interface Shape {
    draw(): void;
}

class Circle implements Shape {
    draw(): void {
        console.log("Drawing Circle");
    }
}

class Rectangle implements Shape {
    draw(): void {
        console.log("Drawing Rectangle");
    }
}

class ShapeFactory {
    static createShape(type: string): Shape | null {
        if (type === "circle") {
            return new Circle();
        } else if (type === "rectangle") {
            return new Rectangle();
        }
        return null;
    }
}
```

**Pros**:
- Reduces coupling between client and concrete classes
- Centralizes object creation
- Easy to add new types

**Cons**:
- Can lead to many factory classes
- Adds complexity for simple scenarios

---

### 1.3 Abstract Factory Pattern

**Definition**: Provides an interface to create families of related or dependent objects without specifying their concrete classes.

**Use Cases**:
- Cross-platform UI component creation
- Database abstraction layers
- Theme creation systems
- UI toolkit implementations

**Implementation**:
```typescript
interface UIElementFactory {
    createButton(): Button;
    createTextBox(): TextBox;
}

class WindowsUIFactory implements UIElementFactory {
    createButton(): Button {
        return new WindowsButton();
    }
    createTextBox(): TextBox {
        return new WindowsTextBox();
    }
}

class MacUIFactory implements UIElementFactory {
    createButton(): Button {
        return new MacButton();
    }
    createTextBox(): TextBox {
        return new MacTextBox();
    }
}
```

**Pros**:
- Ensures consistency among family of objects
- Isolates concrete classes
- Easy to add new families

**Cons**:
- Complex to implement
- Difficult to extend for new product types

---

### 1.4 Builder Pattern

**Definition**: Separates the construction of a complex object from its representation, allowing step-by-step construction.

**Use Cases**:
- Building complex objects with many optional parameters
- Immutable object creation
- SQL query builders
- Configuration object creation
- Request/Response objects in APIs

**Implementation**:
```typescript
class House {
    foundation: string;
    walls: string;
    roof: string;
    hasGarage: boolean;
    hasSwimmingPool: boolean;
    
    private constructor(builder: HouseBuilder) {
        this.foundation = builder.foundation;
        this.walls = builder.walls;
        this.roof = builder.roof;
        this.hasGarage = builder.hasGarage;
        this.hasSwimmingPool = builder.hasSwimmingPool;
    }
    
    static builder(foundation: string, walls: string, roof: string): HouseBuilder {
        return new HouseBuilder(foundation, walls, roof);
    }
}

class HouseBuilder {
    foundation: string;
    walls: string;
    roof: string;
    hasGarage: boolean = false;
    hasSwimmingPool: boolean = false;
    
    constructor(foundation: string, walls: string, roof: string) {
        this.foundation = foundation;
        this.walls = walls;
        this.roof = roof;
    }
    
    withGarage(): HouseBuilder {
        this.hasGarage = true;
        return this;
    }
    
    withSwimmingPool(): HouseBuilder {
        this.hasSwimmingPool = true;
        return this;
    }
    
    build(): House {
        return new House(this);
    }
}
```

**Pros**:
- Improves code readability
- Handles optional parameters elegantly
- Creates immutable objects
- Flexible construction process

**Cons**:
- More lines of code
- Not ideal for simple objects

---

### 1.5 Prototype Pattern

**Definition**: Creates new objects by copying an existing object (prototype) rather than creating from scratch.

**Use Cases**:
- Deep copying objects
- Undo/Redo functionality
- Game object cloning
- Cache management

**Implementation**:
```typescript
abstract class Shape {
    protected type: string;
    protected id: number;
    
    clone(): Shape {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

class Circle extends Shape {
    constructor() {
        super();
        this.type = "Circle";
    }
}
```

**Pros**:
- Avoids costly object creation
- Useful for complex objects
- Runtime performance improvement

**Cons**:
- Deep copy complexity
- Circular reference issues
- Cloning overhead

---

## 2. Structural Patterns

Structural patterns deal with object composition, creating relationships between entities to form larger structures while keeping these structures flexible and efficient.

### 2.1 Adapter Pattern

**Definition**: Converts the interface of a class into another interface clients expect, allowing incompatible objects to collaborate.

**Use Cases**:
- Integrating legacy code
- Third-party library integration
- Payment gateway adapters
- Data format conversion

**Implementation**:
```typescript
// Target interface
interface PaymentProcessor {
    processPayment(amount: number): void;
}

// Incompatible class
class OldPaymentGateway {
    executePayment(amount: number): void {
        console.log("Payment: " + amount);
    }
}

// Adapter
class PaymentAdapter implements PaymentProcessor {
    private oldGateway: OldPaymentGateway;
    
    constructor(gateway: OldPaymentGateway) {
        this.oldGateway = gateway;
    }
    
    processPayment(amount: number): void {
        this.oldGateway.executePayment(amount);
    }
}
```

**Pros**:
- Enables integration of incompatible interfaces
- Reduces code duplication
- Increases flexibility

**Cons**:
- Adds complexity
- Can mask design problems

---

### 2.2 Bridge Pattern

**Definition**: Decouples an abstraction from its implementation so the two can vary independently.

**Use Cases**:
- Database abstraction layers
- Remote control systems
- Graphics rendering systems
- Platform-dependent operations

**Implementation**:
```typescript
// Implementation interface
interface DrawingAPI {
    drawCircle(x: number, y: number, radius: number): void;
}

// Concrete implementations
class RedCircleDrawer implements DrawingAPI {
    drawCircle(x: number, y: number, radius: number): void {
        console.log("Red Circle");
    }
}

// Abstraction
abstract class Shape {
    protected drawingAPI: DrawingAPI;
    
    protected constructor(drawingAPI: DrawingAPI) {
        this.drawingAPI = drawingAPI;
    }
    
    abstract draw(): void;
}

class Circle extends Shape {
    private x: number;
    private y: number;
    private radius: number;
    
    constructor(x: number, y: number, radius: number, drawingAPI: DrawingAPI) {
        super(drawingAPI);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    draw(): void {
        this.drawingAPI.drawCircle(this.x, this.y, this.radius);
    }
}
```

**Pros**:
- Decouples abstraction from implementation
- Reduces class hierarchy
- Flexible to extend

**Cons**:
- Adds complexity
- Might be overkill for simple scenarios

---

### 2.3 Composite Pattern

**Definition**: Composes objects into tree structures to represent part-whole hierarchies, allowing clients to treat individual objects and compositions uniformly.

**Use Cases**:
- File system structures
- UI component hierarchies
- Organizational hierarchies
- Graphics system with shapes and groups

**Implementation**:
```typescript
interface FileSystemComponent {
    display(): void;
    getSize(): number;
}

class File implements FileSystemComponent {
    private name: string;
    private size: number;
    
    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }
    
    display(): void {
        console.log("File: " + this.name);
    }
    
    getSize(): number {
        return this.size;
    }
}

class Directory implements FileSystemComponent {
    private name: string;
    private components: FileSystemComponent[] = [];
    
    constructor(name: string) {
        this.name = name;
    }
    
    add(component: FileSystemComponent): void {
        this.components.push(component);
    }
    
    display(): void {
        console.log("Directory: " + this.name);
        for (const component of this.components) {
            component.display();
        }
    }
    
    getSize(): number {
        return this.components.reduce((sum, component) => sum + component.getSize(), 0);
    }
}
```

**Pros**:
- Simplifies client code
- Easy to add new components
- Treats individual and composite objects uniformly

**Cons**:
- Can make design too general
- Type checking becomes difficult

---

### 2.4 Decorator Pattern

**Definition**: Attaches additional responsibilities to an object dynamically, providing a flexible alternative to subclassing.

**Use Cases**:
- Adding features to objects without modifying originals
- I/O stream wrappers (BufferedInputStream, DataInputStream)
- GUI component decoration
- Logger decoration

**Implementation**:
```typescript
interface Coffee {
    getCost(): number;
    getDescription(): string;
}

class SimpleCoffee implements Coffee {
    getCost(): number {
        return 2.0;
    }
    
    getDescription(): string {
        return "Simple Coffee";
    }
}

abstract class CoffeeDecorator implements Coffee {
    protected coffee: Coffee;
    
    constructor(coffee: Coffee) {
        this.coffee = coffee;
    }
    
    abstract getCost(): number;
    abstract getDescription(): string;
}

class MilkDecorator extends CoffeeDecorator {
    constructor(coffee: Coffee) {
        super(coffee);
    }
    
    getCost(): number {
        return this.coffee.getCost() + 0.5;
    }
    
    getDescription(): string {
        return this.coffee.getDescription() + ", Milk";
    }
}

class SugarDecorator extends CoffeeDecorator {
    constructor(coffee: Coffee) {
        super(coffee);
    }
    
    getCost(): number {
        return this.coffee.getCost() + 0.2;
    }
    
    getDescription(): string {
        return this.coffee.getDescription() + ", Sugar";
    }
}
```

**Pros**:
- More flexible than subclassing
- Can combine multiple decorators
- Single Responsibility Principle

**Cons**:
- Creates many small classes
- Can be confusing with many decorators

---

### 2.5 Facade Pattern

**Definition**: Provides a unified, simplified interface to a set of interfaces in a subsystem.

**Use Cases**:
- Database access layer
- Payment gateway interfaces
- Library wrapper APIs
- Complex subsystem simplification

**Implementation**:
```typescript
class CPU {
    freeze(): void {
        console.log("CPU freeze");
    }
    jump(position: number): void {
        console.log("CPU jump");
    }
    execute(): void {
        console.log("CPU execute");
    }
}

class Memory {
    load(position: number, data: number[]): void {
        console.log("Memory load");
    }
}

class HardDrive {
    read(lba: number, size: number): number[] {
        console.log("HardDrive read");
        return new Array(size);
    }
}

// Facade
class ComputerFacade {
    private cpu: CPU;
    private memory: Memory;
    private hardDrive: HardDrive;
    
    constructor() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }
    
    startComputer(): void {
        this.cpu.freeze();
        this.memory.load(0, this.hardDrive.read(0, 1024));
        this.cpu.jump(0);
        this.cpu.execute();
    }
}
```

**Pros**:
- Simplifies client code
- Decouples client from subsystem
- Easy to maintain

**Cons**:
- Can become bloated
- Might hide important functionality

---

### 2.6 Flyweight Pattern

**Definition**: Uses sharing to support large numbers of fine-grained objects efficiently.

**Use Cases**:
- Text editor character objects
- Game sprite rendering
- Connection pooling
- Immutable object caching

**Implementation**:
```typescript
interface Character {
    display(fontSize: number): void;
}

class ConcreteCharacter implements Character {
    private character: string;
    
    constructor(character: string) {
        this.character = character;
    }
    
    display(fontSize: number): void {
        console.log("Character: " + this.character + ", Size: " + fontSize);
    }
}

class CharacterFactory {
    private static characters: Map<string, Character> = new Map();
    
    static getCharacter(character: string): Character {
        if (!this.characters.has(character)) {
            this.characters.set(character, new ConcreteCharacter(character));
        }
        return this.characters.get(character)!;
    }
}
```

**Pros**:
- Reduces memory usage significantly
- Improves performance
- Effective for large numbers of similar objects

**Cons**:
- Adds complexity
- Thread-safety concerns
- Not suitable for mutable objects

---

### 2.7 Proxy Pattern

**Definition**: Provides a placeholder or surrogate for another object to control access to it.

**Use Cases**:
- Lazy loading of expensive objects
- Access control
- Logging and monitoring
- Remote object access (RPC)
- Caching

**Implementation**:
```typescript
interface Database {
    query(sql: string): string;
}

class RealDatabase implements Database {
    query(sql: string): string {
        console.log("Executing: " + sql);
        return "Query Result";
    }
}

class DatabaseProxy implements Database {
    private realDatabase: RealDatabase | null = null;
    private userRole: string;
    
    constructor(userRole: string) {
        this.userRole = userRole;
    }
    
    query(sql: string): string {
        if (!this.hasAccess()) {
            throw new Error("Access Denied");
        }
        if (!this.realDatabase) {
            this.realDatabase = new RealDatabase();
        }
        return this.realDatabase.query(sql);
    }
    
    private hasAccess(): boolean {
        return this.userRole === "admin";
    }
}
```

**Pros**:
- Controls access to expensive objects
- Enables lazy initialization
- Adds security layer
- Logging and monitoring capability

**Cons**:
- Adds complexity
- Performance overhead
- Harder to debug

---

## 3. Behavioral Patterns

Behavioral patterns focus on communication between objects, defining how objects interact and distribute responsibility.

### 3.1 Observer Pattern

**Definition**: Defines a one-to-many dependency where when one object changes state, all dependents are notified automatically.

**Use Cases**:
- Event handling systems
- MVC frameworks
- Message brokers
- Notification systems
- Data binding in UI

**Implementation**:
```typescript
interface Observer {
    update(message: string): void;
}

class ConcreteObserver implements Observer {
    private name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    update(message: string): void {
        console.log(this.name + " received: " + message);
    }
}

class Subject {
    private observers: Observer[] = [];
    
    attach(observer: Observer): void {
        this.observers.push(observer);
    }
    
    detach(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    
    notifyObservers(message: string): void {
        for (const observer of this.observers) {
            observer.update(message);
        }
    }
}
```

**Pros**:
- Loose coupling between subject and observers
- Dynamic subscription/unsubscription
- Supports broadcast communication

**Cons**:
- Observers notified in random order
- Memory leaks if not unsubscribed
- Performance issues with many observers

---

### 3.2 Strategy Pattern

**Definition**: Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

**Use Cases**:
- Sorting algorithms
- Payment methods
- Compression algorithms
- Discount calculations
- Routing algorithms

**Implementation**:
```typescript
interface PaymentStrategy {
    pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
    pay(amount: number): void {
        console.log("Paying " + amount + " via Credit Card");
    }
}

class PayPalPayment implements PaymentStrategy {
    pay(amount: number): void {
        console.log("Paying " + amount + " via PayPal");
    }
}

class ShoppingCart {
    private strategy: PaymentStrategy;
    
    setPaymentStrategy(strategy: PaymentStrategy): void {
        this.strategy = strategy;
    }
    
    checkout(amount: number): void {
        this.strategy.pay(amount);
    }
}
```

**Pros**:
- Encapsulates varying behavior
- Eliminates conditional statements
- Easy to add new strategies
- Runtime algorithm selection

**Cons**:
- Increases number of classes
- Overkill for simple scenarios
- Client must know about strategies

---

### 3.3 Command Pattern

**Definition**: Encapsulates a request as an object, allowing you to parameterize clients with different requests, queue requests, and log requests.

**Use Cases**:
- Undo/Redo functionality
- Macro recording
- Callback mechanisms
- Task scheduling
- Remote invocation

**Implementation**:
```typescript
interface Command {
    execute(): void;
    undo(): void;
}

class LightOnCommand implements Command {
    private light: Light;
    
    constructor(light: Light) {
        this.light = light;
    }
    
    execute(): void {
        this.light.on();
    }
    
    undo(): void {
        this.light.off();
    }
}

class Light {
    on(): void {
        console.log("Light is ON");
    }
    off(): void {
        console.log("Light is OFF");
    }
}

class Invoker {
    private command: Command;
    private history: Command[] = [];
    
    setCommand(command: Command): void {
        this.command = command;
    }
    
    execute(): void {
        this.command.execute();
        this.history.push(this.command);
    }
    
    undo(): void {
        if (this.history.length > 0) {
            const lastCommand = this.history.pop()!;
            lastCommand.undo();
        }
    }
}
```

**Pros**:
- Decouples sender from receiver
- Supports undo/redo
- Can queue and schedule commands
- Easy to add new commands

**Cons**:
- Many classes for complex systems
- Potential memory overhead

---

### 3.4 State Pattern

**Definition**: Allows an object to alter its behavior when its internal state changes, appearing to change its class.

**Use Cases**:
- Order processing workflow
- Media player states
- Connection states
- State machines
- Game character states

**Implementation**:
```typescript
interface State {
    handle(): void;
}

class PlayingState implements State {
    private player: MediaPlayer;
    
    constructor(player: MediaPlayer) {
        this.player = player;
    }
    
    handle(): void {
        console.log("Music is playing");
        this.player.setState(new PausedState(this.player));
    }
}

class PausedState implements State {
    private player: MediaPlayer;
    
    constructor(player: MediaPlayer) {
        this.player = player;
    }
    
    handle(): void {
        console.log("Music is paused");
        this.player.setState(new PlayingState(this.player));
    }
}

class MediaPlayer {
    private state: State;
    
    setState(state: State): void {
        this.state = state;
    }
    
    play(): void {
        this.state.handle();
    }
}
```

**Pros**:
- Eliminates large conditional statements
- Encapsulates state-specific behavior
- Simplifies state transitions
- Single Responsibility Principle

**Cons**:
- Increases number of classes
- Can be overkill for simple states
- Difficult to debug state transitions

---

### 3.5 Template Method Pattern

**Definition**: Defines the skeleton of an algorithm in a base class and lets subclasses override specific steps.

**Use Cases**:
- Database query execution
- Data processing pipelines
- Framework hooks
- Algorithm frameworks
- Document rendering

**Implementation**:
```typescript
abstract class DataProcessor {
    // Template method
    processData(data: string): void {
        const extractedData = this.extract(data);
        const transformedData = this.transform(extractedData);
        this.load(transformedData);
    }
    
    protected abstract extract(data: string): string;
    protected abstract transform(data: string): string;
    protected abstract load(data: string): void;
}

class CSVProcessor extends DataProcessor {
    protected extract(data: string): string {
        console.log("Extracting CSV data");
        return data;
    }
    
    protected transform(data: string): string {
        console.log("Transforming CSV data");
        return data;
    }
    
    protected load(data: string): void {
        console.log("Loading CSV data");
    }
}
```

**Pros**:
- Code reusability
- Enforces algorithm structure
- Inversion of Control
- Easy to extend

**Cons**:
- Limited flexibility
- Violation of Liskov Substitution Principle if not careful
- Tight coupling between base and subclasses

---

### 3.6 Chain of Responsibility Pattern

**Definition**: Passes requests along a chain of handlers where each handler decides to process or pass it along.

**Use Cases**:
- Logging frameworks (different log levels)
- HTTP request middleware
- Approval workflows
- Event handling
- Exception handling

**Implementation**:
```typescript
abstract class Logger {
    protected nextLogger: Logger | null;
    protected level: number;
    
    setNextLogger(nextLogger: Logger): void {
        this.nextLogger = nextLogger;
    }
    
    logMessage(level: number, message: string): void {
        if (this.level <= level) {
            this.write(message);
        }
        if (this.nextLogger) {
            this.nextLogger.logMessage(level, message);
        }
    }
    
    protected abstract write(message: string): void;
}

class ConsoleLogger extends Logger {
    constructor(level: number) {
        super();
        this.level = level;
    }
    
    protected write(message: string): void {
        console.log("Console Log: " + message);
    }
}

class FileLogger extends Logger {
    constructor(level: number) {
        super();
        this.level = level;
    }
    
    protected write(message: string): void {
        console.log("File Log: " + message);
    }
}
```

**Pros**:
- Decouples sender from receivers
- Dynamic chain configuration
- Easy to add/remove handlers
- Single Responsibility Principle

**Cons**:
- Request might not be handled
- Difficult to debug
- Performance overhead

---

### 3.7 Iterator Pattern

**Definition**: Provides a way to access elements of a collection sequentially without exposing its underlying representation.

**Use Cases**:
- Collection traversal
- Database query results
- File system traversal
- Stream processing
- Tree traversal

**Implementation**:
```typescript
interface Iterator<T> {
    hasNext(): boolean;
    next(): T;
}

interface Collection<T> {
    createIterator(): Iterator<T>;
}

class ArrayCollection<T> implements Collection<T> {
    private items: T[];
    
    constructor(items: T[]) {
        this.items = items;
    }
    
    createIterator(): Iterator<T> {
        return new ArrayIterator(this.items);
    }
}

class ArrayIterator<T> implements Iterator<T> {
    private items: T[];
    private index: number = 0;
    
    constructor(items: T[]) {
        this.items = items;
    }
    
    hasNext(): boolean {
        return this.index < this.items.length;
    }
    
    next(): T {
        return this.items[this.index++];
    }
}
```

**Pros**:
- Simplifies collection traversal
- Encapsulates internal structure
- Multiple simultaneous iterations
- Single Responsibility Principle

**Cons**:
- Overhead for simple collections
- Limited functionality compared to direct access

---

### 3.8 Mediator Pattern

**Definition**: Defines an object that encapsulates how a set of objects interact, promoting loose coupling.

**Use Cases**:
- Chat room systems
- Air traffic control
- UI dialog boxes
- Game state management
- Component communication

**Implementation**:
```typescript
interface ChatMediator {
    sendMessage(message: string, sender: User): void;
    registerUser(user: User): void;
}

class ConcreteChatMediator implements ChatMediator {
    private users: User[] = [];
    
    registerUser(user: User): void {
        this.users.push(user);
        user.setMediator(this);
    }
    
    sendMessage(message: string, sender: User): void {
        for (const user of this.users) {
            if (user !== sender) {
                user.receiveMessage(message);
            }
        }
    }
}

abstract class User {
    protected mediator: ChatMediator;
    protected name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    setMediator(mediator: ChatMediator): void {
        this.mediator = mediator;
    }
    
    sendMessage(message: string): void {
        this.mediator.sendMessage(message, this);
    }
    
    receiveMessage(message: string): void {
        console.log(this.name + " received: " + message);
    }
}
```

**Pros**:
- Decouples object communication
- Centralizes control logic
- Easy to modify communication rules
- Reduces object dependencies

**Cons**:
- Mediator can become complex
- Concentrates control logic
- Can violate Single Responsibility Principle

---

### 3.9 Memento Pattern

**Definition**: Captures and externalizes an object's internal state without violating encapsulation, allowing restoration later.

**Use Cases**:
- Undo/Redo functionality
- Game save states
- Transaction rollback
- Checkpoint systems
- Version control

**Implementation**:
```typescript
class Memento {
    private state: string;
    
    constructor(state: string) {
        this.state = state;
    }
    
    getState(): string {
        return this.state;
    }
}

class Editor {
    private content: string;
    
    write(text: string): void {
        this.content = text;
    }
    
    save(): Memento {
        return new Memento(this.content);
    }
    
    restore(memento: Memento): void {
        this.content = memento.getState();
    }
    
    getContent(): string {
        return this.content;
    }
}

class History {
    private mementos: Memento[] = [];
    
    save(memento: Memento): void {
        this.mementos.push(memento);
    }
    
    undo(): Memento | null {
        if (this.mementos.length > 0) {
            return this.mementos.pop() || null;
        }
        return null;
    }
}
```

**Pros**:
- Preserves encapsulation
- Simplifies undo/redo implementation
- Snapshot-based restoration
- Non-intrusive approach

**Cons**:
- Memory overhead for storing states
- Difficult for large objects
- Performance implications

---

### 3.10 Visitor Pattern

**Definition**: Represents an operation to be performed on elements of an object structure, allowing new operations without changing the structures.

**Use Cases**:
- AST traversal in compilers
- Report generation
- XML/JSON processing
- Object serialization
- Game object updates

**Implementation**:
```typescript
interface Visitor {
    visit(circle: Circle): void;
    visitRectangle(rectangle: Rectangle): void;
}

interface Shape {
    accept(visitor: Visitor): void;
}

class Circle implements Shape {
    private radius: number;
    
    constructor(radius: number) {
        this.radius = radius;
    }
    
    getRadius(): number {
        return this.radius;
    }
    
    accept(visitor: Visitor): void {
        visitor.visit(this);
    }
}

class AreaCalculator implements Visitor {
    visit(circle: Circle): void {
        console.log("Circle area: " + (Math.PI * circle.getRadius() * circle.getRadius()));
    }
    
    visitRectangle(rectangle: Rectangle): void {
        console.log("Rectangle area: " + (rectangle.getWidth() * rectangle.getHeight()));
    }
}
```

**Pros**:
- Separates algorithms from object structures
- Easy to add new operations
- Complex operations cleanly
- Follows Open/Closed Principle

**Cons**:
- Difficult to add new element types
- Violates Single Responsibility Principle
- Breaks encapsulation
- Complex implementation

---

### 3.11 Interpreter Pattern

**Definition**: Defines a representation for a grammar and an interpreter to interpret sentences in that language.

**Use Cases**:
- SQL query parsers
- Expression evaluators
- Domain-specific languages
- Configuration parsers
- Search query interpreters

**Implementation**:
```typescript
interface Expression {
    interpret(): number;
}

class NumberExpression implements Expression {
    private number: number;
    
    constructor(number: number) {
        this.number = number;
    }
    
    interpret(): number {
        return this.number;
    }
}

class AddExpression implements Expression {
    private left: Expression;
    private right: Expression;
    
    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }
    
    interpret(): number {
        return this.left.interpret() + this.right.interpret();
    }
}

class MultiplyExpression implements Expression {
    private left: Expression;
    private right: Expression;
    
    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }
    
    interpret(): number {
        return this.left.interpret() * this.right.interpret();
    }
}
```

**Pros**:
- Represents grammar in code
- Easy to add new grammar rules
- Separates grammar from interpretation

**Cons**:
- Complex grammar becomes difficult
- Performance issues for large inputs
- Limited to simple languages
- Hard to debug

---

## Design Pattern Selection Guide

| Problem | Pattern | Pros | Cons |
|---------|---------|------|------|
| Single instance needed | Singleton | Simple, global access | Hard to test, hides dependencies |
| Object creation logic | Factory | Centralized, extensible | Extra classes |
| Family of related objects | Abstract Factory | Consistent families | Complexity, hard to extend |
| Complex object construction | Builder | Readable, flexible | More code |
| Avoid expensive creation | Prototype | Performance | Deep copy complexity |
| Incompatible interfaces | Adapter | Integration, flexibility | Adds complexity |
| Abstraction-implementation separation | Bridge | Flexibility, extensibility | Complexity for simple cases |
| Tree hierarchies | Composite | Uniform treatment | Type checking difficult |
| Add features dynamically | Decorator | Flexible, composable | Many small classes |
| Simplify complex subsystem | Facade | Simple interface | Hides functionality |
| Many similar fine-grained objects | Flyweight | Memory efficient | Complexity, thread-safety |
| Control object access | Proxy | Access control, lazy loading | Performance overhead |
| Notify multiple dependents | Observer | Loose coupling, broadcast | Random notification order |
| Interchangeable algorithms | Strategy | Flexible, eliminates conditionals | Client must know strategies |
| Encapsulate requests | Command | Undo/redo, queueing | Many classes |
| Behavior varies by state | State | Eliminates conditionals, encapsulation | Class explosion |
| Algorithm skeleton | Template Method | Code reuse, structure enforcement | Limited flexibility |
| Pass request along chain | Chain of Responsibility | Decoupled, dynamic | Request might not be handled |
| Sequential collection access | Iterator | Encapsulation, uniform access | Performance overhead |
| Reduce object coupling | Mediator | Centralized control | Complexity, tight coupling to mediator |
| Capture and restore state | Memento | Undo/redo, encapsulation | Memory overhead |
| Add new operations | Visitor | Easy to add operations | Hard to add new elements |
| Parse and interpret grammar | Interpreter | Code representation of grammar | Performance, complex |

---

## Best Practices

1. **Don't Over-Engineer**: Use patterns only when they solve specific problems
2. **SOLID Principles**: Combine patterns with SOLID principles for better design
3. **Keep It Simple**: Simple solutions are often better than complex patterns
4. **Team Understanding**: Ensure team understands patterns used in codebase
5. **Documentation**: Document why a pattern is used
6. **Testing**: Patterns should make code easier to test
7. **Performance**: Be aware of performance implications
8. **Avoid Anti-patterns**: Don't create God Objects or unnecessary abstraction

---

## Common Combinations

- **Factory + Singleton**: Singleton factory that creates objects
- **Decorator + Strategy**: Decorate objects with different strategies
- **Observer + Mediator**: Mediator coordinates observer notifications
- **Template Method + Strategy**: Template defines structure, strategy defines specific steps
- **Composite + Iterator**: Iterate through composite structures
- **Proxy + Factory**: Factory creates proxies for real objects
- **Builder + Abstract Factory**: Builder constructs complex objects from families

---

## Conclusion

Design patterns are powerful tools for creating maintainable, scalable, and robust software. However, they should be used judiciously. Understand the problem first, then apply the pattern that best fits the solution. Remember that premature design pattern adoption can lead to over-engineering. Always consider the specific context and constraints of your system before applying any pattern.
