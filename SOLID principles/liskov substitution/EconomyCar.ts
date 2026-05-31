import { Vehicle } from './Vehicle';

/**
 * EconomyCar Implementation
 *
 * Honors the Vehicle contract:
 * - Returns positive daily rental cost
 * - Calculates cost correctly for given days
 * - Consumes fuel proportionally
 * - Always returns accurate max speed and consumption
 */

export class EconomyCar extends Vehicle {
	private readonly model: string = 'Toyota Corolla';

	constructor() {
		super();
		this.dailyRentalCost = 40; // $40/day
	}

	getMaxSpeed(): number {
		return 180; // km/h
	}

	getFuelConsumption(): number {
		return 15; // 15 km per liter - good efficiency
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
