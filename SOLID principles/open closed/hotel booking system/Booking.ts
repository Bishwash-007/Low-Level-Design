/**
 * GUEST CLASS
 * Represents a hotel guest booking a room
 */

export class Guest {
	guestId: string;
	name: string;
	email: string;
	phone: string;
	numberOfGuests: number;

	constructor(
		guestId: string,
		name: string,
		email: string,
		phone: string,
		numberOfGuests: number,
	) {
		this.guestId = guestId;
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.numberOfGuests = numberOfGuests;
	}

	getGuestInfo(): object {
		return {
			guestId: this.guestId,
			name: this.name,
			email: this.email,
			phone: this.phone,
			numberOfGuests: this.numberOfGuests,
		};
	}
}

/**
 * BOOKING CLASS
 * Represents a hotel booking
 */

import { Room } from './Room';

export class Booking {
	bookingId: string;
	guest: Guest;
	room: Room;
	checkInDate: Date;
	checkOutDate: Date;
	status: 'Pending' | 'Confirmed' | 'Cancelled';
	totalPrice: number;
	createdAt: Date;

	constructor(
		bookingId: string,
		guest: Guest,
		room: Room,
		checkInDate: Date,
		checkOutDate: Date,
	) {
		this.bookingId = bookingId;
		this.guest = guest;
		this.room = room;
		this.checkInDate = checkInDate;
		this.checkOutDate = checkOutDate;
		this.status = 'Pending';
		this.createdAt = new Date();

		// Calculate total price
		const numberOfNights = Math.ceil(
			(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		this.totalPrice = room.getPrice(numberOfNights);
	}

	/**
	 * Confirms the booking
	 */
	confirm(): void {
		this.status = 'Confirmed';
		this.room.reserve();
	}

	/**
	 * Cancels the booking
	 */
	cancel(): void {
		this.status = 'Cancelled';
		this.room.release();
	}

	/**
	 * Gets number of nights
	 */
	getNumberOfNights(): number {
		return Math.ceil(
			(this.checkOutDate.getTime() - this.checkInDate.getTime()) /
				(1000 * 60 * 60 * 24),
		);
	}

	/**
	 * Gets booking details
	 */
	getBookingDetails(): object {
		return {
			bookingId: this.bookingId,
			guest: this.guest.getGuestInfo(),
			room: this.room.getRoomInfo(),
			checkInDate: this.checkInDate.toLocaleDateString(),
			checkOutDate: this.checkOutDate.toLocaleDateString(),
			numberOfNights: this.getNumberOfNights(),
			totalPrice: this.totalPrice,
			status: this.status,
			createdAt: this.createdAt.toLocaleString(),
		};
	}
}
