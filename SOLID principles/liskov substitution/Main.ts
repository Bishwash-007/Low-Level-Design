/**
 * LISKOV SUBSTITUTION PRINCIPLE - Complete Example
 *
 * This demonstrates how LSP enables polymorphism:
 * - Different vehicle types work seamlessly with RentalService
 * - No type checking needed in RentalService
 * - New vehicle types can be added without modifying RentalService
 */

import { Vehicle } from './Vehicle';
import { EconomyCar } from './EconomyCar';
import { SUV } from './SUV';
import { SportsCar } from './SportsCar';
import { ElectricVehicle } from './ElectricVehicle';
import { RentalService } from './RentalService';

function main() {
	console.log('\n');
	console.log('   LISKOV SUBSTITUTION PRINCIPLE');
	console.log('   Vehicle Rental System Demo');
	console.log('\n');

	const rentalService = new RentalService();

	// KEY LSP PRINCIPLE:
	// We can store different vehicle types in one array
	// All honor the Vehicle contract
	const vehicles: { id: string; vehicle: Vehicle }[] = [
		{ id: 'eco-001', vehicle: new EconomyCar() },
		{ id: 'suv-001', vehicle: new SUV() },
		{ id: 'sport-001', vehicle: new SportsCar() },
		{ id: 'ev-001', vehicle: new ElectricVehicle() },
	];

	console.log('\n 1 RENTING DIFFERENT VEHICLE TYPES\n');

	vehicles.forEach(({ id, vehicle }) => {
		try {
			rentalService.rentVehicle(id, vehicle, 5);
			console.log(`   Daily cost: $${vehicle.getDailyRentalCost()}`);
			console.log(`   Max speed: ${vehicle.getMaxSpeed()} km/h`);
			console.log(`   Efficiency: ${vehicle.getFuelConsumption()} km/L\n`);
		} catch (error) {
			console.error(`   Error: ${(error as Error).message}\n`);
		}
	});

	console.log(
		'\n 2  CALCULATING TRIP COSTS (LSP: Same method works for all)\n',
	);

	vehicles.forEach(({ id, vehicle }) => {
		try {
			const tripCost = rentalService.calculateTripCost(vehicle, 500, 5);
			console.log(`   ${id}: Trip cost = $${tripCost}`);
		} catch (error) {
			console.error(`   ${id}: Error - ${(error as Error).message}`);
		}
	});

	console.log('\n 3  SIMULATING TRIPS (LSP: Polymorphic behavior)\n');

	vehicles.forEach(({ id, vehicle }) => {
		console.log(`\n   >>> ${id}`);
		rentalService.simulateTrip(vehicle, 400);
	});

	console.log('\n 4  RETURNING VEHICLES\n');

	vehicles.forEach(({ id }) => {
		try {
			const cost = rentalService.returnVehicle(id);
		} catch (error) {
			console.error(`   Error: ${(error as Error).message}`);
		}
	});

	console.log('\n 5 KEY LSP DEMONSTRATION\n');
	console.log('    Same RentalService works with all vehicle types');
	console.log('    No instanceof checks or type casting needed');
	console.log('    All vehicles honor the Vehicle contract');
	console.log('    Polymorphism works seamlessly');
	console.log('    Easy to add new vehicle types without changes\n');

	console.log('\n 6  ADDING NEW VEHICLE TYPE - HybridCar\n');
	console.log('   (No changes needed to RentalService!)\n');

	class HybridCar extends Vehicle {
		constructor() {
			super();
			this.dailyRentalCost = 65;
		}

		getMaxSpeed(): number {
			return 190;
		}

		getFuelConsumption(): number {
			return 12;
		}

		getDailyRentalCost(): number {
			return this.dailyRentalCost;
		}

		calculateRentalCost(days: number): number {
			return days > 0 ? this.dailyRentalCost * days : 0;
		}

		consumeFuel(kilometers: number): void {
			const fuelUsed = (kilometers / this.getFuelConsumption()) * 100;
			this.fuelPercentage = Math.max(0, this.fuelPercentage - fuelUsed);
		}
	}

	const hybrid = new HybridCar();
	rentalService.rentVehicle('hybrid-001', hybrid, 3);
	console.log(
		`   Hybrid car rental cost (3 days): $${hybrid.calculateRentalCost(3)}`,
	);
	console.log(`   Daily cost: $${hybrid.getDailyRentalCost()}`);
	rentalService.simulateTrip(hybrid, 300);
	rentalService.returnVehicle('hybrid-001');

	console.log('\n 7  WHY LSP MATTERS\n');
	console.log('   Without LSP:');
	console.log('    RentalService would need instanceof checks');
	console.log('    Different handling for each vehicle type');
	console.log('    Adding new types would require modifying RentalService');
	console.log('    Higher risk of bugs and maintenance issues\n');

	console.log('   With LSP:');
	console.log('    Clean, simple, maintainable code');
	console.log('    Extensible system (add new vehicles easily)');
	console.log('    All polymorphic calls work reliably');
	console.log('    No type-specific logic needed\n');

	console.log('');
	console.log('   LSP ensures substitutability!');
	console.log('\n');
}

main();
