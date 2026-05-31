import { Vehicle } from './Vehicle';

/**
 * ElectricVehicle Implementation
 *
 * Honors the Vehicle contract:
 * - Returns positive daily rental cost
 * - Calculates cost correctly for given days
 * - Consumes energy/fuel proportionally (battery instead of fuel)
 * - Always returns accurate max speed and consumption
 *
 * LSP: Even though the energy source is different (battery vs fuel),
 * the contract is still honored completely.
 */

export class ElectricVehicle extends Vehicle {
	private readonly model: string = 'Tesla Model S';
	private readonly batteryCapacity: number = 100; // kWh

	constructor() {
		super();
		this.dailyRentalCost = 90; // $90/day
	}

	getMaxSpeed(): number {
		return 220; // km/h
	}

	getFuelConsumption(): number {
		return 5; // 5 km per kWh - electric efficiency metric
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
	 * Honors contract: Battery drains like fuel
	 * From the caller's perspective, this is the same as fuel consumption
	 */
	consumeFuel(kilometers: number): void {
		const energyUsed = (kilometers / this.getFuelConsumption()) * 100;
		this.fuelPercentage = Math.max(0, this.fuelPercentage - energyUsed);
	}

	/**
	 * Utility method specific to electric vehicles
	 */
	getBatteryStatus(): string {
		return `Battery: ${this.fuelPercentage.toFixed(1)}% (${(this.fuelPercentage / 100) * this.batteryCapacity}/${this.batteryCapacity} kWh)`;
	}

	/**
	 * Charge the vehicle (overrides refuel for clarity)
	 */
	chargeBattery(): void {
		this.fuelPercentage = 100;
	}

	getModel(): string {
		return this.model;
	}
}
