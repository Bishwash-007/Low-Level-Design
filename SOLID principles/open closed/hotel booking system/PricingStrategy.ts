/**
 * PRICING STRATEGY - OPEN/CLOSED PRINCIPLE
 *
 * The PricingStrategy interface is CLOSED for modification
 * We can add new pricing/discount strategies by implementing PricingStrategy
 * without modifying the BookingService
 */

/**
 * Abstract Pricing Strategy
 * Responsibility: Define the contract for pricing calculations
 *
 * This is CLOSED for modification - it defines the interface
 * This is OPEN for extension - new pricing strategies can implement this
 */
export interface PricingStrategy {
	calculatePrice(basePrice: number, numberOfNights: number): number;
	getStrategyName(): string;
}

/**
 * Standard Pricing - No discount
 */
export class StandardPricing implements PricingStrategy {
	calculatePrice(basePrice: number, numberOfNights: number): number {
		return basePrice * numberOfNights;
	}

	getStrategyName(): string {
		return 'Standard Pricing';
	}
}

/**
 * Early Bird Discount - 15% off for bookings made 30+ days in advance
 */
export class EarlyBirdPricing implements PricingStrategy {
	private daysInAdvance: number;

	constructor(daysInAdvance: number) {
		this.daysInAdvance = daysInAdvance;
	}

	calculatePrice(basePrice: number, numberOfNights: number): number {
		if (this.daysInAdvance >= 30) {
			const discount = basePrice * numberOfNights * 0.15;
			console.log(
				`    Early Bird Discount Applied: -$${discount.toFixed(2)}`,
			);
			return basePrice * numberOfNights * 0.85;
		}
		return basePrice * numberOfNights;
	}

	getStrategyName(): string {
		return `Early Bird Pricing (${this.daysInAdvance} days in advance)`;
	}
}

/**
 * Weekend Surcharge - 20% extra for weekend stays
 */
export class WeekendSurchargePricing implements PricingStrategy {
	private isWeekend: boolean;

	constructor(isWeekend: boolean) {
		this.isWeekend = isWeekend;
	}

	calculatePrice(basePrice: number, numberOfNights: number): number {
		if (this.isWeekend) {
			const surcharge = basePrice * numberOfNights * 0.2;
			console.log(`   Weekend Surcharge Applied: +$${surcharge.toFixed(2)}`);
			return basePrice * numberOfNights * 1.2;
		}
		return basePrice * numberOfNights;
	}

	getStrategyName(): string {
		return 'Weekend Surcharge Pricing';
	}
}

/**
 * Long Stay Discount - Progressive discount based on number of nights
 */
export class LongStayPricing implements PricingStrategy {
	calculatePrice(basePrice: number, numberOfNights: number): number {
		let discount = 0;

		if (numberOfNights >= 7 && numberOfNights < 14) {
			discount = 0.1; // 10% off for 7-13 nights
			console.log(`     7-Night Discount Applied: 10%`);
		} else if (numberOfNights >= 14 && numberOfNights < 30) {
			discount = 0.15; // 15% off for 14-29 nights
			console.log(`     14-Night Discount Applied: 15%`);
		} else if (numberOfNights >= 30) {
			discount = 0.25; // 25% off for 30+ nights
			console.log(`     30-Night Discount Applied: 25%`);
		}

		return basePrice * numberOfNights * (1 - discount);
	}

	getStrategyName(): string {
		return 'Long Stay Pricing';
	}
}

/**
 * Seasonal Pricing - Different rates for peak and off-season
 */
export class SeasonalPricing implements PricingStrategy {
	private season: 'peak' | 'off-season';

	constructor(season: 'peak' | 'off-season') {
		this.season = season;
	}

	calculatePrice(basePrice: number, numberOfNights: number): number {
		if (this.season === 'peak') {
			const surcharge = basePrice * numberOfNights * 0.3;
			console.log(
				`    Peak Season Surcharge Applied: +$${surcharge.toFixed(2)}`,
			);
			return basePrice * numberOfNights * 1.3;
		} else {
			const discount = basePrice * numberOfNights * 0.2;
			console.log(
				`     Off-Season Discount Applied: -$${discount.toFixed(2)}`,
			);
			return basePrice * numberOfNights * 0.8;
		}
	}

	getStrategyName(): string {
		return `Seasonal Pricing (${this.season})`;
	}
}

/**
 * Group Booking Discount - Discount for multiple rooms
 */
export class GroupBookingPricing implements PricingStrategy {
	private numberOfRooms: number;

	constructor(numberOfRooms: number) {
		this.numberOfRooms = numberOfRooms;
	}

	calculatePrice(basePrice: number, numberOfNights: number): number {
		let discount = 0;

		if (this.numberOfRooms >= 3 && this.numberOfRooms < 5) {
			discount = 0.1; // 10% off for 3-4 rooms
			console.log(`    Group Discount (3-4 rooms) Applied: 10%`);
		} else if (this.numberOfRooms >= 5) {
			discount = 0.2; // 20% off for 5+ rooms
			console.log(`    Group Discount (5+ rooms) Applied: 20%`);
		}

		return basePrice * numberOfNights * (1 - discount);
	}

	getStrategyName(): string {
		return `Group Booking Pricing (${this.numberOfRooms} rooms)`;
	}
}

/**
 * Member Loyalty Discount - VIP member discount
 */
export class MemberLoyaltyPricing implements PricingStrategy {
	private memberLevel: 'silver' | 'gold' | 'platinum';

	constructor(memberLevel: 'silver' | 'gold' | 'platinum') {
		this.memberLevel = memberLevel;
	}

	calculatePrice(basePrice: number, numberOfNights: number): number {
		let discount = 0;

		switch (this.memberLevel) {
			case 'silver':
				discount = 0.05; // 5% off
				console.log(`   Silver Member Discount Applied: 5%`);
				break;
			case 'gold':
				discount = 0.1; // 10% off
				console.log(`   Gold Member Discount Applied: 10%`);
				break;
			case 'platinum':
				discount = 0.2; // 20% off
				console.log(`   Platinum Member Discount Applied: 20%`);
				break;
		}

		return basePrice * numberOfNights * (1 - discount);
	}

	getStrategyName(): string {
		return `Member Loyalty Pricing (${this.memberLevel.toUpperCase()})`;
	}
}
