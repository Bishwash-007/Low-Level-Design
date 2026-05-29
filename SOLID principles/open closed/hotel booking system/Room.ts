/**
 * ROOM TYPES - OPEN/CLOSED PRINCIPLE
 *
 * The Room class is CLOSED for modification but OPEN for extension
 * We can add new room types by extending the base Room class
 * without modifying the existing Room class
 */

/**
 * Abstract Base Room Class
 * Responsibility: Define the contract for all room types
 *
 * This abstract class is CLOSED for modification - it defines the interface
 * It is OPEN for extension - new room types can inherit from this
 */
export abstract class Room {
	roomNumber: string;
	isAvailable: boolean;
	maxOccupancy: number;
	amenities: string[];
	basePricePerNight: number;

	constructor(
		roomNumber: string,
		maxOccupancy: number,
		basePricePerNight: number,
		amenities: string[] = [],
	) {
		this.roomNumber = roomNumber;
		this.maxOccupancy = maxOccupancy;
		this.basePricePerNight = basePricePerNight;
		this.amenities = amenities;
		this.isAvailable = true;
	}

	/**
	 * Abstract method - each room type must implement their own description
	 */
	abstract getRoomType(): string;

	/**
	 * Abstract method - each room type can override pricing
	 */
	abstract getPrice(numberOfNights: number): number;

	/**
	 * Reserves the room
	 */
	reserve(): void {
		this.isAvailable = false;
	}

	/**
	 * Releases the room
	 */
	release(): void {
		this.isAvailable = true;
	}

	/**
	 * Gets room information
	 */
	getRoomInfo(): object {
		return {
			roomNumber: this.roomNumber,
			type: this.getRoomType(),
			maxOccupancy: this.maxOccupancy,
			basePricePerNight: this.basePricePerNight,
			amenities: this.amenities,
			isAvailable: this.isAvailable,
		};
	}
}

/**
 * Standard Room - EXTENSION of base Room class
 * Closed for modification, Open for extension
 */
export class StandardRoom extends Room {
	constructor(roomNumber: string) {
		super(roomNumber, 2, 100, ['WiFi', 'TV', 'Bathroom']);
	}

	getRoomType(): string {
		return 'Standard Room';
	}

	getPrice(numberOfNights: number): number {
		return this.basePricePerNight * numberOfNights;
	}
}

/**
 * Deluxe Room - EXTENSION of base Room class
 * Closed for modification, Open for extension
 */
export class DeluxeRoom extends Room {
	constructor(roomNumber: string) {
		super(roomNumber, 3, 200, [
			'WiFi',
			'TV',
			'Bathroom',
			'Mini Bar',
			'Balcony',
		]);
	}

	getRoomType(): string {
		return 'Deluxe Room';
	}

	getPrice(numberOfNights: number): number {
		return this.basePricePerNight * numberOfNights;
	}
}

/**
 * Suite Room - EXTENSION of base Room class
 * Closed for modification, Open for extension
 */
export class SuiteRoom extends Room {
	constructor(roomNumber: string) {
		super(roomNumber, 4, 350, [
			'WiFi',
			'TV',
			'Bathroom',
			'Mini Bar',
			'Balcony',
			'Living Room',
			'Kitchen',
		]);
	}

	getRoomType(): string {
		return 'Suite Room';
	}

	getPrice(numberOfNights: number): number {
		return this.basePricePerNight * numberOfNights;
	}
}

/**
 * Budget Room - EXTENSION of base Room class
 * Easy to add without modifying any existing code
 */
export class BudgetRoom extends Room {
	constructor(roomNumber: string) {
		super(roomNumber, 1, 50, ['WiFi', 'Bathroom']);
	}

	getRoomType(): string {
		return 'Budget Room';
	}

	getPrice(numberOfNights: number): number {
		return this.basePricePerNight * numberOfNights;
	}
}

/**
 * Penthouse - EXTENSION of base Room class
 * Another easy extension without modifying anything
 */
export class Penthouse extends Room {
	constructor(roomNumber: string) {
		super(roomNumber, 6, 800, [
			'WiFi',
			'TV',
			'Multiple Bathrooms',
			'Mini Bar',
			'Terrace',
			'Living Room',
			'Kitchen',
			'Gym Equipment',
			'Jacuzzi',
		]);
	}

	getRoomType(): string {
		return 'Penthouse';
	}

	getPrice(numberOfNights: number): number {
		// Penthouse has premium pricing
		return this.basePricePerNight * numberOfNights * 1.1;
	}
}
