// ========== OBJECT-ORIENTED PROGRAMMING (OOP) CONCEPTS - JAVA ==========

// ============ ABSTRACTION ============
// Definition: Hide internal complexity, show only essential features
// Benefits: Simplifies interface, reduces complexity, provides focus

// Real-world example: Payment processing
public abstract class PaymentProcessor {
    // Abstract method - must be implemented by subclasses
    public abstract boolean process(BigDecimal amount);
    
    // Concrete method - common logic
    public final void logTransaction(String txnId, BigDecimal amount) {
        System.out.println("[LOG] Transaction: " + txnId + " Amount: " + amount);
    }
    
    // Template method - defines algorithm structure
    public final PaymentResponse executePayment(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        
        boolean success = process(amount);
        String txnId = generateTransactionId();
        logTransaction(txnId, amount);
        
        return new PaymentResponse(success, txnId);
    }
    
    protected String generateTransactionId() {
        return UUID.randomUUID().toString();
    }
}

// Concrete implementations
public class CreditCardProcessor extends PaymentProcessor {
    @Override
    public boolean process(BigDecimal amount) {
        System.out.println("[CreditCard] Processing " + amount);
        // Credit card specific logic
        return true;
    }
}

public class PayPalProcessor extends PaymentProcessor {
    @Override
    public boolean process(BigDecimal amount) {
        System.out.println("[PayPal] Processing " + amount);
        // PayPal specific logic
        return true;
    }
}

// Usage - Client doesn't need to know specific implementation
@Service
public class PaymentService {
    public PaymentResponse pay(PaymentProcessor processor, BigDecimal amount) {
        return processor.executePayment(amount);
    }
}

// Benefits:
// - Client only knows about PaymentProcessor, not implementations
// - Easy to add new payment methods
// - Complex logic hidden behind simple interface

// ============ ENCAPSULATION ============
// Definition: Bundle data and methods, hide internal state
// Benefits: Data protection, controlled access, maintainability

//  VIOLATION: Public attributes, uncontrolled access
public class BankAccountBad {
    public double balance;
    public String accountNumber;
    
    public void withdraw(double amount) {
        balance -= amount; // No validation!
    }
}

//  SOLUTION: Private attributes with controlled access
@Entity
@Data
public class BankAccount {
    @Id
    private String accountNumber;
    
    private double balance;
    private final BigDecimal MINIMUM_BALANCE = new BigDecimal("100.00");
    private final BigDecimal MAX_WITHDRAWAL = new BigDecimal("5000.00");
    
    // Private constructor - controlled instantiation
    private BankAccount() {}
    
    // Factory method for creation
    public static BankAccount create(String accountNumber, double initialBalance) {
        if (initialBalance < 100) {
            throw new IllegalArgumentException("Initial balance must be >= 100");
        }
        BankAccount account = new BankAccount();
        account.accountNumber = accountNumber;
        account.balance = initialBalance;
        return account;
    }
    
    // Public getter - read-only access
    public double getBalance() {
        return balance;
    }
    
    // Controlled withdrawal method
    public void withdraw(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        
        BigDecimal withdrawAmount = new BigDecimal(amount);
        if (withdrawAmount.compareTo(MAX_WITHDRAWAL) > 0) {
            throw new IllegalArgumentException("Withdrawal exceeds limit: " + MAX_WITHDRAWAL);
        }
        
        BigDecimal newBalance = new BigDecimal(balance).subtract(withdrawAmount);
        if (newBalance.compareTo(MINIMUM_BALANCE) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }
        
        balance = newBalance.doubleValue();
        System.out.println("[Account] Withdrawn: " + amount + ", New balance: " + balance);
    }
    
    // Controlled deposit method
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        balance += amount;
        System.out.println("[Account] Deposited: " + amount + ", New balance: " + balance);
    }
}

// Benefits:
// - Balance cannot be directly modified
// - Validation enforced on every operation
// - Can change internal implementation without affecting clients
// - Easy to add logging, auditing

// ============ INHERITANCE ============
// Definition: Create new classes based on existing classes
// Benefits: Code reuse, hierarchical relationships, polymorphism

// Base class - common functionality
public abstract class Animal {
    protected String name;
    protected int age;
    
    public Animal(String name, int age) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name required");
        }
        this.name = name;
        this.age = age;
    }
    
    // Abstract method - must implement
    public abstract String makeSound();
    
    // Concrete method - available to all subclasses
    public void eat() {
        System.out.println(name + " is eating");
    }
    
    public void sleep() {
        System.out.println(name + " is sleeping");
    }
}

// Specific animal - inherits from Animal
public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, int age, String breed) {
        super(name, age);
        this.breed = breed;
    }
    
    @Override
    public String makeSound() {
        return "Woof! Woof!";
    }
    
    // Dog-specific method
    public void fetch() {
        System.out.println(name + " is fetching the ball");
    }
}

public class Cat extends Animal {
    private boolean indoor;
    
    public Cat(String name, int age, boolean indoor) {
        super(name, age);
        this.indoor = indoor;
    }
    
    @Override
    public String makeSound() {
        return "Meow! Meow!";
    }
    
    // Cat-specific method
    public void scratch() {
        System.out.println(name + " is scratching");
    }
}

// Usage with polymorphism
@Service
public class AnimalService {
    public void animalDaycare(List<Animal> animals) {
        for (Animal animal : animals) {
            System.out.println(animal.getName() + " says: " + animal.makeSound());
            animal.eat();
            animal.sleep();
        }
    }
}

// Benefits:
// - Code reuse (Animal methods in Dog, Cat)
// - Organized hierarchy
// - Polymorphic behavior

// ============ POLYMORPHISM ============
// Definition: Same operation, different behaviors for different objects
// Benefits: Flexible code, extensibility, maintainability

// Interface - defines contract
public interface Shape {
    double calculateArea();
    double calculatePerimeter();
}

// Implementations
public class Circle implements Shape {
    private double radius;
    
    public Circle(double radius) {
        if (radius <= 0) {
            throw new IllegalArgumentException("Radius must be positive");
        }
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double calculatePerimeter() {
        return 2 * Math.PI * radius;
    }
}

public class Rectangle implements Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        if (width <= 0 || height <= 0) {
            throw new IllegalArgumentException("Dimensions must be positive");
        }
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
    
    @Override
    public double calculatePerimeter() {
        return 2 * (width + height);
    }
}

public class Triangle implements Shape {
    private double a, b, c;
    
    public Triangle(double a, double b, double c) {
        if (a <= 0 || b <= 0 || c <= 0) {
            throw new IllegalArgumentException("Sides must be positive");
        }
        if (a + b <= c || b + c <= a || a + c <= b) {
            throw new IllegalArgumentException("Invalid triangle");
        }
        this.a = a;
        this.b = b;
        this.c = c;
    }
    
    @Override
    public double calculateArea() {
        double s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }
    
    @Override
    public double calculatePerimeter() {
        return a + b + c;
    }
}

// Polymorphic usage - same code works with all shapes
@Service
public class GeometryService {
    public void analyzeShapes(List<Shape> shapes) {
        for (Shape shape : shapes) {
            System.out.println("Area: " + shape.calculateArea());
            System.out.println("Perimeter: " + shape.calculatePerimeter());
        }
    }
    
    public double totalArea(List<Shape> shapes) {
        return shapes.stream()
            .mapToDouble(Shape::calculateArea)
            .sum();
    }
}

// Usage
List<Shape> shapes = Arrays.asList(
    new Circle(5),
    new Rectangle(4, 6),
    new Triangle(3, 4, 5)
);
geometryService.analyzeShapes(shapes); // Works for all shapes!

// Benefits:
// - Same method call produces different behavior
// - Easy to add new shapes
// - Service logic doesn't need to know specific types

// ============ COMPOSITION OVER INHERITANCE ============
// Definition: Use composition instead of inheritance for flexibility
// Benefits: Flexibility, avoids brittle hierarchies, easier to test

//  INHERITANCE approach - less flexible
public abstract class Engine {
    public abstract void start();
}

public class DieselEngine extends Engine {
    @Override
    public void start() {
        System.out.println("Starting diesel engine");
    }
}

public class PetrolEngine extends Engine {
    @Override
    public void start() {
        System.out.println("Starting petrol engine");
    }
}

// Requires new class for each combination
public class DieselSedan extends Car {
    private DieselEngine engine = new DieselEngine();
}

public class PetrolSedan extends Car {
    private PetrolEngine engine = new PetrolEngine();
}

//  COMPOSITION approach - more flexible
public interface Engine {
    void start();
    void stop();
}

public class DieselEngine implements Engine {
    @Override
    public void start() {
        System.out.println("Starting diesel engine");
    }
    
    @Override
    public void stop() {
        System.out.println("Stopping diesel engine");
    }
}

public class PetrolEngine implements Engine {
    @Override
    public void start() {
        System.out.println("Starting petrol engine");
    }
    
    @Override
    public void stop() {
        System.out.println("Stopping petrol engine");
    }
}

public class ElectricEngine implements Engine {
    @Override
    public void start() {
        System.out.println("Starting electric engine");
    }
    
    @Override
    public void stop() {
        System.out.println("Stopping electric engine");
    }
}

@Entity
public class Car {
    private Engine engine;
    private String model;
    
    public Car(String model, Engine engine) {
        if (model == null || model.isBlank()) {
            throw new IllegalArgumentException("Model required");
        }
        if (engine == null) {
            throw new IllegalArgumentException("Engine required");
        }
        this.model = model;
        this.engine = engine;
    }
    
    public void start() {
        engine.start();
    }
    
    public void stop() {
        engine.stop();
    }
}

// Now any combination works!
Car sedan = new Car("Sedan", new DieselEngine());
Car suv = new Car("SUV", new PetrolEngine());
Car eco = new Car("EcoCar", new ElectricEngine());

// Benefits:
// - No class explosion
// - Easy to add new engine types
// - Easy to change engine at runtime
// - Better testability

// ============ SUMMARY TABLE ============
/*
Concept           | Purpose                           | Key Benefit
------------------|-----------------------------------|-----------------------
Abstraction       | Hide complexity, show essentials  | Simplified interface
Encapsulation     | Bundle data & methods, hide state | Data protection
Inheritance       | Create hierarchy, share code      | Code reuse
Polymorphism      | Same operation, different behavior| Flexibility
Composition       | Build via combining objects       | Flexibility > Inheritance
*/
