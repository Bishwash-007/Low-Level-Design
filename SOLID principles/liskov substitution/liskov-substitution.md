# Liskov Substitution Principle (LSP) - Vehicle Rental System

## Definition

The **Liskov Substitution Principle** states that:

> **Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.**

This means:
- **Substitutability**: If class `B` is a subclass of class `A`, you should be able to replace `A` with `B` without altering the correctness of the program
- **Contract Adherence**: Subtypes must not violate the contract (preconditions and postconditions) established by their base types
- **Behavioral Consistency**: Subclasses should behave in a way that's consistent with what's expected from the parent class

## Why is LSP Important?

### 1. **Reliability**
When subclasses properly adhere to the parent contract, you can trust that any subclass will work correctly in place of the parent.

### 2. **Maintainability**
Code using parent type references remains stable even when new subclasses are added.

### 3. **Extensibility**
You can extend the system with new implementations without affecting existing code.

### 4. **Reduced Bugs**
Prevents unexpected behavior when base class references are used polymorphically.

### 5. **Testability**
You can write tests for the base class interface and be confident they work for all subclasses.

## How to Achieve LSP

### 1. **Understand the Contract**
Clearly define what the parent class promises to do.

### 2. **Design Subclasses to Honor the Contract**
Subclasses must implement behavior that satisfies the parent's expectations.

### 3. **Don't Strengthen Preconditions**
A subclass method cannot require more restrictive conditions than the parent.

### 4. **Don't Weaken Postconditions**
A subclass method must provide results at least as good as the parent.

### 5. **Throw Only Expected Exceptions**
Subclasses should not throw unexpected checked exceptions.

---

## Common LSP Violations

###  Violation 1: Square/Rectangle Problem

```typescript
// BAD - Violates LSP
class Rectangle {
  protected width: number;
  protected height: number;

  setWidth(width: number) { this.width = width; }
  setHeight(height: number) { this.height = height; }
  getArea(): number { return this.width * this.height; }
}

class Square extends Rectangle {
  // Problem: Square overrides both setWidth and setHeight
  // Setting width to 5 and height to 10 violates Square's constraint
  setWidth(width: number) { this.width = width; this.height = width; }
  setHeight(height: number) { this.width = height; this.height = height; }
}

// Consumer code breaks
const rect: Rectangle = new Square();
rect.setWidth(5);
rect.setHeight(10);
console.log(rect.getArea()); // Expected: 50, Got: 100 
```

###  Violation 2: Ignoring Contracts

```typescript
// BAD - Payment processor violates contract
class PaymentProcessor {
  processPayment(amount: number): boolean {
    if (amount > 0) return true;
    return false;
  }
}

class CryptoPaymentProcessor extends PaymentProcessor {
  // Violates contract: should return true for valid payments
  processPayment(amount: number): boolean {
    throw new Error("Crypto service temporarily unavailable");
  }
}

// This breaks consumer code
const processor: PaymentProcessor = new CryptoPaymentProcessor();
processor.processPayment(100); // Expected: boolean, Got: exception 
```

###  Violation 3: Unexpected Type Changes

```typescript
// BAD - Changed return type contract
class Bird {
  fly(): number { return 10; } // Distance traveled
}

class Penguin extends Bird {
  fly(): number { return 0; } // Penguins can't fly!
}

const bird: Bird = new Penguin();
const distance = bird.fly(); // Expected: > 0, Got: 0 
```

---

## Vehicle Rental System Architecture

### System Overview

```
Vehicle (BASE CLASS - Contract)
    ↓
    ├─ Car (Valid: Standard vehicle)
    ├─ SUV (Valid: Larger vehicle, same contract)
    ├─ SportsCar (Valid: Faster, same contract)
    └─ ElectricVehicle (Valid: Different fuel, same contract)

RentalService (Uses Vehicle polymorphically)
```

### Core Concept

All vehicles must satisfy this contract:
- Can be rented for N days
- Can travel at some speed
- Consume fuel/power
- Can be returned
- Provide rental cost

---

## LSP-Compliant Vehicle Rental System

### Base Vehicle Contract

```typescript
export abstract class Vehicle {
  protected rentedDays: number = 0;
  protected fuelPercentage: number = 100;
  protected dailyRentalCost: number;

  abstract getMaxSpeed(): number;
  abstract getFuelConsumption(): number; // km per liter
  abstract getDailyRentalCost(): number;
  abstract calculateRentalCost(days: number): number;
  abstract consumeFuel(kilometers: number): void;

  rentVehicle(days: number): void {
    if (days <= 0) throw new Error("Rental days must be positive");
    this.rentedDays = days;
  }

  returnVehicle(): number {
    if (this.rentedDays === 0) throw new Error("Vehicle not rented");
    const cost = this.calculateRentalCost(this.rentedDays);
    this.rentedDays = 0;
    return cost;
  }

  canTravel(kilometers: number): boolean {
    const fuelNeeded = kilometers / this.getFuelConsumption();
    return (this.fuelPercentage / 100) >= fuelNeeded;
  }
}
```

**Contract Obligations for All Subclasses:**
- `rentVehicle()` should accept positive integer days
- `returnVehicle()` should return a positive number (cost)
- `canTravel()` should accurately determine if vehicle can travel distance
- `getFuelConsumption()` should return a positive number
- `getDailyRentalCost()` should return a positive number

---

## Vehicle Implementations (LSP Compliant)

### 1. Economy Car

```typescript
export class EconomyCar extends Vehicle {
  constructor() {
    super();
    this.dailyRentalCost = 40; // $40/day
  }

  getMaxSpeed(): number {
    return 180; // km/h
  }

  getFuelConsumption(): number {
    return 15; // 15 km per liter
  }

  getDailyRentalCost(): number {
    return this.dailyRentalCost;
  }

  calculateRentalCost(days: number): number {
    // Honors contract: returns cost based on days
    if (days <= 0) return 0;
    return this.dailyRentalCost * days;
  }

  consumeFuel(kilometers: number): void {
    // Honors contract: consumes fuel proportionally
    const fuelUsed = (kilometers / this.getFuelConsumption()) * 100;
    this.fuelPercentage = Math.max(0, this.fuelPercentage - fuelUsed);
  }
}
```

### 2. SUV

```typescript
export class SUV extends Vehicle {
  constructor() {
    super();
    this.dailyRentalCost = 75; // $75/day
  }

  getMaxSpeed(): number {
    return 200; // km/h
  }

  getFuelConsumption(): number {
    return 8; // 8 km per liter (less efficient)
  }

  getDailyRentalCost(): number {
    return this.dailyRentalCost;
  }

  calculateRentalCost(days: number): number {
    // Honors contract: returns cost based on days
    if (days <= 0) return 0;
    return this.dailyRentalCost * days;
  }

  consumeFuel(kilometers: number): void {
    // Honors contract: consumes fuel proportionally
    const fuelUsed = (kilometers / this.getFuelConsumption()) * 100;
    this.fuelPercentage = Math.max(0, this.fuelPercentage - fuelUsed);
  }
}
```

### 3. Sports Car

```typescript
export class SportsCar extends Vehicle {
  constructor() {
    super();
    this.dailyRentalCost = 150; // $150/day
  }

  getMaxSpeed(): number {
    return 300; // km/h
  }

  getFuelConsumption(): number {
    return 6; // 6 km per liter (performance oriented)
  }

  getDailyRentalCost(): number {
    return this.dailyRentalCost;
  }

  calculateRentalCost(days: number): number {
    // Honors contract: returns cost based on days
    if (days <= 0) return 0;
    return this.dailyRentalCost * days;
  }

  consumeFuel(kilometers: number): void {
    // Honors contract: consumes fuel proportionally
    const fuelUsed = (kilometers / this.getFuelConsumption()) * 100;
    this.fuelPercentage = Math.max(0, this.fuelPercentage - fuelUsed);
  }
}
```

### 4. Electric Vehicle

```typescript
export class ElectricVehicle extends Vehicle {
  private batteryCapacity: number = 100; // kWh

  constructor() {
    super();
    this.dailyRentalCost = 90; // $90/day
  }

  getMaxSpeed(): number {
    return 220; // km/h
  }

  getFuelConsumption(): number {
    return 5; // 5 km per kWh (electric efficiency)
  }

  getDailyRentalCost(): number {
    return this.dailyRentalCost;
  }

  calculateRentalCost(days: number): number {
    // Honors contract: returns cost based on days
    if (days <= 0) return 0;
    return this.dailyRentalCost * days;
  }

  consumeFuel(kilometers: number): void {
    // Honors contract: battery drains like fuel
    const energyUsed = (kilometers / this.getFuelConsumption()) * 100;
    this.fuelPercentage = Math.max(0, this.fuelPercentage - energyUsed);
  }

  getBatteryStatus(): string {
    return `Battery: ${this.fuelPercentage.toFixed(1)}%`;
  }
}
```

---

## Rental Service (Works with any Vehicle)

```typescript
export class RentalService {
  private rentedVehicles: Map<string, Vehicle> = new Map();

  rentVehicle(vehicleId: string, vehicle: Vehicle, days: number): void {
    if (!vehicle) throw new Error("Invalid vehicle");
    if (days <= 0) throw new Error("Days must be positive");

    // LSP: Works with ANY Vehicle subclass
    vehicle.rentVehicle(days);
    this.rentedVehicles.set(vehicleId, vehicle);
    console.log(` Vehicle rented for ${days} days`);
  }

  returnVehicle(vehicleId: string): number {
    const vehicle = this.rentedVehicles.get(vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");

    // LSP: returnVehicle() always returns cost
    const cost = vehicle.returnVehicle();
    this.rentedVehicles.delete(vehicleId);
    console.log(` Vehicle returned. Cost: $${cost}`);
    return cost;
  }

  calculateTripCost(vehicle: Vehicle, kilometers: number, days: number): number {
    // LSP: Can calculate cost for ANY vehicle type
    const rentalCost = vehicle.calculateRentalCost(days);
    const canTravel = vehicle.canTravel(kilometers);

    if (!canTravel) {
      throw new Error("Vehicle has insufficient fuel for this trip");
    }

    return rentalCost;
  }

  simulateTrip(vehicle: Vehicle, kilometers: number): boolean {
    // LSP: Can simulate trip for ANY vehicle type
    console.log(`\n--- Trip Simulation ---`);
    console.log(`Distance: ${kilometers} km`);
    console.log(`Max Speed: ${vehicle.getMaxSpeed()} km/h`);
    console.log(`Consumption: ${vehicle.getFuelConsumption()} km/L`);

    if (!vehicle.canTravel(kilometers)) {
      console.log(" Insufficient fuel!");
      return false;
    }

    vehicle.consumeFuel(kilometers);
    console.log(" Trip completed successfully");
    return true;
  }
}
```

---

## LSP in Action

### Example: Same Code Works for All Vehicles

```typescript
const rental = new RentalService();

// Array can hold ANY vehicle - they all honor the contract
const vehicles: Vehicle[] = [
  new EconomyCar(),
  new SUV(),
  new SportsCar(),
  new ElectricVehicle()
];

vehicles.forEach((vehicle, index) => {
  try {
    rental.rentVehicle(`vehicle-${index}`, vehicle, 5);
    const tripCost = rental.calculateTripCost(vehicle, 500, 5);
    console.log(`Daily cost: $${vehicle.getDailyRentalCost()}`);
    console.log(`Total trip cost: $${tripCost}\n`);
    rental.returnVehicle(`vehicle-${index}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
});
```

**Key Point:** The `RentalService` doesn't need to know about specific vehicle types. Every vehicle honors the contract, so polymorphism works perfectly!

---

## Benefits Demonstrated

### 1. **Add New Vehicle Type Without Modifying RentalService**

```typescript
export class HybridCar extends Vehicle {
  constructor() {
    super();
    this.dailyRentalCost = 65;
  }

  getMaxSpeed(): number { return 190; }
  getFuelConsumption(): number { return 12; }
  getDailyRentalCost(): number { return this.dailyRentalCost; }
  calculateRentalCost(days: number): number {
    return days > 0 ? this.dailyRentalCost * days : 0;
  }
  consumeFuel(kilometers: number): void {
    const fuelUsed = (kilometers / this.getFuelConsumption()) * 100;
    this.fuelPercentage = Math.max(0, this.fuelPercentage - fuelUsed);
  }
}

// Works immediately with RentalService - no code changes!
const hybrid = new HybridCar();
rental.rentVehicle("hybrid-1", hybrid, 3);
```

### 2. **Polymorphic Collections Work Reliably**

```typescript
// Can store different vehicles in same collection
const fleet: Vehicle[] = [
  new EconomyCar(),
  new SUV(),
  new ElectricVehicle(),
  new HybridCar()
];

// All will behave correctly
fleet.forEach(vehicle => {
  console.log(`Cost: $${vehicle.getDailyRentalCost()}`);
});
```

### 3. **Mock Testing is Easy**

```typescript
// Test implementation that honors contract
class TestVehicle extends Vehicle {
  getMaxSpeed(): number { return 100; }
  getFuelConsumption(): number { return 10; }
  getDailyRentalCost(): number { return 50; }
  calculateRentalCost(days: number): number {
    return days > 0 ? 50 * days : 0;
  }
  consumeFuel(kilometers: number): void {
    this.fuelPercentage -= (kilometers / 10) * 100;
  }
}

// Works seamlessly with RentalService
const testVehicle = new TestVehicle();
rental.rentVehicle("test", testVehicle, 2);
```

---

## LSP Violations to Avoid

###  Bad: Vehicle That Doesn't Consume Fuel

```typescript
// VIOLATES LSP - breaks contract
class FlyingCar extends Vehicle {
  consumeFuel(kilometers: number): void {
    // Does nothing - flying cars don't need fuel!
    // This breaks consumer assumptions
  }
}
```

###  Bad: Vehicle That Can't Be Returned

```typescript
// VIOLATES LSP - breaks contract
class RentalScooter extends Vehicle {
  returnVehicle(): number {
    throw new Error("Scooters must be returned to specific stations");
    // Violates contract: method should return cost, not throw
  }
}
```

###  Bad: Vehicle with Unexpected Behavior

```typescript
// VIOLATES LSP - breaks contract
class LuxurySport extends Vehicle {
  calculateRentalCost(days: number): number {
    // Double-charges on weekends - contract doesn't mention this!
    const isWeekend = true; // simplified
    return isWeekend ? this.dailyRentalCost * days * 2 : this.dailyRentalCost * days;
  }
}
```

---

## Summary

### LSP Ensures:
 Subclasses can be used wherever parent is expected  
 Polymorphism works reliably  
 Adding new types doesn't break existing code  
 Contract consistency across all implementations  
 Easier testing and maintenance  

### Remember:
> **"If it looks like a duck, quacks like a duck, but needs batteries, then you have the wrong abstraction."** — LSP Principle

By following LSP, you create flexible, reliable, and maintainable object-oriented systems.
