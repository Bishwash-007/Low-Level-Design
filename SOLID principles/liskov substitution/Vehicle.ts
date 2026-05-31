/**
 * LISKOV SUBSTITUTION PRINCIPLE
 *
 * The abstract Vehicle class defines a contract that all subclasses must honor.
 * Any subclass must be substitutable for the parent class without breaking the application.
 */

export abstract class Vehicle {
	protected rentedDays: number = 0;
	protected fuelPercentage: number = 100;
	protected dailyRentalCost: number = 0;

	/**
	 * Returns the maximum speed the vehicle can achieve (km/h)
	 * Contract: Must return a positive number
	 */
	abstract getMaxSpeed(): number;

	/**
	 * Returns the fuel/energy efficiency (km per liter/kWh)
	 * Contract: Must return a positive number
	 */
	abstract getFuelConsumption(): number;

	/**
	 * Returns the daily rental cost in dollars
	 * Contract: Must return a positive number
	 */
	abstract getDailyRentalCost(): number;

	/**
	 * Calculates the total rental cost for given days
	 * Contract: Must return (dailyRate * days) for positive days
	 */
	abstract calculateRentalCost(days: number): number;

	/**
	 * Consumes fuel/energy based on distance traveled
	 * Contract: fuelPercentage should decrease proportionally
	 */
	abstract consumeFuel(kilometers: number): void;

	/**
	 * Rents the vehicle for specified days
	 * Contract: Must accept positive days, throw error for invalid input
	 */
	rentVehicle(days: number): void {
		if (days <= 0) {
			throw new Error('Rental days must be positive');
		}
		this.rentedDays = days;
	}

	/**
	 * Returns the vehicle and provides the rental cost
	 * Contract: Must return a positive number (cost)
	 */
	returnVehicle(): number {
		if (this.rentedDays === 0) {
			throw new Error('Vehicle not rented');
		}
		const cost = this.calculateRentalCost(this.rentedDays);
		this.rentedDays = 0;
		return cost;
	}

	/**
	 * Determines if vehicle can travel the given distance
	 * Contract: Must return boolean based on fuel availability
	 */
	canTravel(kilometers: number): boolean {
		const fuelNeeded = kilometers / this.getFuelConsumption();
		return this.fuelPercentage / 100 >= fuelNeeded;
	}

	/**
	 * Get current fuel percentage
	 */
	getFuelPercentage(): number {
		return this.fuelPercentage;
	}

	/**
	 * Check if vehicle is currently rented
	 */
	isRented(): boolean {
		return this.rentedDays > 0;
	}

	/**
	 * Refuel the vehicle to 100%
	 */
	refuel(): void {
		this.fuelPercentage = 100;
	}
}
