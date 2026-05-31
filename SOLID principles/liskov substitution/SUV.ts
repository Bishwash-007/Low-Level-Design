import { Vehicle } from './Vehicle';

/**
 * SUV Implementation
 *
 * Honors the Vehicle contract:
 * - Returns positive daily rental cost
 * - Calculates cost correctly for given days
 * - Consumes fuel proportionally (less efficient than economy car)
 * - Always returns accurate max speed and consumption
 */

export class SUV extends Vehicle {
	private readonly model: string = 'Toyota Highlander';

	constructor() {
		super();
		this.dailyRentalCost = 75; // $75/day
	}

	getMaxSpeed(): number {
		return 200; // km/h
	}

	getFuelConsumption(): number {
		return 8; // 8 km per liter - less efficient due to size
	}

	getDailyRentalCost(): number {
		return this.dailyRentalCost;
	}

	/**
	 * Honors contract: Returns daily rate × days for positive days
	 */
	calculateRentalCost(days: number): number {
		if (days <= 0) return 0;
		return this.dailyRentalCost * days;
	}

	/**
	 * Honors contract: Consumes fuel proportionally
	 */
	consumeFuel(kilometers: number): void {
		const fuelUsed = (kilometers / this.getFuelConsumption()) * 100;
		this.fuelPercentage = Math.max(0, this.fuelPercentage - fuelUsed);
	}

	getModel(): string {
		return this.model;
	}
}
