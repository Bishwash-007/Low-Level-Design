import { Vehicle } from './Vehicle';

/**
 * RentalService
 *
 * This service demonstrates LSP in action:
 * - It works with ANY Vehicle subclass
 * - It doesn't need to know the specific type
 * - Any future Vehicle implementation will work without changes
 */

export class RentalService {
	private rentedVehicles: Map<string, Vehicle> = new Map();

	/**
	 * Rent a vehicle for specified days
	 *
	 * LSP: Works with any Vehicle because all honor the contract
	 */
	rentVehicle(vehicleId: string, vehicle: Vehicle, days: number): void {
		if (!vehicle) {
			throw new Error('Invalid vehicle');
		}
		if (days <= 0) {
			throw new Error('Days must be positive');
		}

		// This call works with ANY Vehicle subclass
		vehicle.rentVehicle(days);
		this.rentedVehicles.set(vehicleId, vehicle);
		console.log(` Vehicle rented for ${days} days`);
	}

	/**
	 * Return a vehicle
	 *
	 * LSP: returnVehicle() always returns the cost, regardless of vehicle type
	 */
	returnVehicle(vehicleId: string): number {
		const vehicle = this.rentedVehicles.get(vehicleId);
		if (!vehicle) {
			throw new Error('Vehicle not found in rental records');
		}

		// This call works with ANY Vehicle subclass
		const cost = vehicle.returnVehicle();
		this.rentedVehicles.delete(vehicleId);
		console.log(` Vehicle returned. Rental cost: $${cost}`);
		return cost;
	}

	/**
	 * Calculate the cost for a trip
	 *
	 * LSP: This method works polymorphically with any Vehicle
	 */
	calculateTripCost(
		vehicle: Vehicle,
		kilometers: number,
		days: number,
	): number {
		if (!vehicle) {
			throw new Error('Invalid vehicle');
		}
		if (kilometers < 0 || days <= 0) {
			throw new Error('Invalid trip parameters');
		}

		const rentalCost = vehicle.calculateRentalCost(days);
		const canTravel = vehicle.canTravel(kilometers);

		if (!canTravel) {
			throw new Error(
				`Vehicle has insufficient fuel (${vehicle.getFuelPercentage().toFixed(1)}%) for ${kilometers}km trip`,
			);
		}

		return rentalCost;
	}

	/**
	 * Simulate a trip with a vehicle
	 *
	 * LSP: Works with any Vehicle type
	 */
	simulateTrip(vehicle: Vehicle, kilometers: number): boolean {
		if (!vehicle) {
			throw new Error('Invalid vehicle');
		}

		console.log(`\n--- Trip Simulation ---`);
		console.log(`Distance: ${kilometers} km`);
		console.log(`Max Speed: ${vehicle.getMaxSpeed()} km/h`);
		console.log(`Efficiency: ${vehicle.getFuelConsumption()} km/L`);
		console.log(`Fuel Level: ${vehicle.getFuelPercentage().toFixed(1)}%`);

		if (!vehicle.canTravel(kilometers)) {
			console.log(' Insufficient fuel for this trip!');
			return false;
		}

		vehicle.consumeFuel(kilometers);
		console.log(
			`Trip completed! Remaining fuel: ${vehicle.getFuelPercentage().toFixed(1)}%`,
		);
		return true;
	}

	/**
	 * Check if a vehicle is currently rented
	 */
	isVehicleRented(vehicleId: string): boolean {
		const vehicle = this.rentedVehicles.get(vehicleId);
		return vehicle ? vehicle.isRented() : false;
	}

	/**
	 * Refuel all rented vehicles
	 *
	 * LSP: This works with all vehicles, even those with batteries
	 */
	refuelAllVehicles(): void {
		this.rentedVehicles.forEach((vehicle, vehicleId) => {
			vehicle.refuel();
			console.log(`Refueled vehicle ${vehicleId}`);
		});
	}

	/**
	 * Get fleet statistics
	 */
	getFleetStats(): object {
		const stats = {
			totalRented: this.rentedVehicles.size,
			vehicles: Array.from(this.rentedVehicles.values()).map((v) => ({
				dailyCost: v.getDailyRentalCost(),
				maxSpeed: v.getMaxSpeed(),
				fuelLevel: v.getFuelPercentage().toFixed(1),
			})),
		};
		return stats;
	}
}
