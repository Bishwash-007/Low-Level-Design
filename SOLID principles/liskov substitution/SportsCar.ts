import { Vehicle } from './Vehicle';

/**
 * SportsCar Implementation
 *
 * Honors the Vehicle contract:
 * - Returns positive daily rental cost
 * - Calculates cost correctly for given days
 * - Consumes fuel proportionally (performance-oriented consumption)
 * - Always returns accurate max speed and consumption
 */

export class SportsCar extends Vehicle {
	private readonly model: string = 'Ferrari F8 Tributo';

	constructor() {
		super();
		this.dailyRentalCost = 150; // $150/day
	}

	getMaxSpeed(): number {
		return 300; // km/h - high performance
	}

	getFuelConsumption(): number {
		return 6; // 6 km per liter - lower efficiency due to performance
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
