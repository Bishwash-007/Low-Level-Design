/**
 * BOOKING SERVICE - OPEN/CLOSED PRINCIPLE
 *
 * This service is CLOSED for modification - it doesn't change
 * It is OPEN for extension through strategies (payment, pricing, notification)
 *
 * When adding new payment methods, pricing strategies, or notification channels,
 * we extend through strategies without modifying BookingService
 */

import { Booking } from './Booking';
import { Room } from './Room';
import { Guest } from './Booking';
import { PaymentStrategy } from './PaymentStrategy';
import { PricingStrategy } from './PricingStrategy';
import { NotificationStrategy } from './NotificationStrategy';

export class BookingService {
	private bookings: Booking[] = [];
	private bookingIdCounter: number = 1000;

	/**
	 * Creates a new booking
	 * CLOSED for modification - uses strategies to handle payment, pricing, notifications
	 * OPEN for extension - can accept any PaymentStrategy, PricingStrategy, NotificationStrategy
	 */
	createBooking(
		guest: Guest,
		room: Room,
		checkInDate: Date,
		checkOutDate: Date,
		paymentStrategy: PaymentStrategy,
		pricingStrategy: PricingStrategy,
		notificationStrategy: NotificationStrategy,
	): Booking | null {
		try {
			// Check if room is available
			if (!room.isAvailable) {
				console.log(` Room ${room.roomNumber} is not available`);
				return null;
			}

			// Check occupancy
			if (guest.numberOfGuests > room.maxOccupancy) {
				console.log(
					` Room capacity (${room.maxOccupancy}) cannot accommodate ${guest.numberOfGuests} guests`,
				);
				return null;
			}

			// Create booking
			const booking = new Booking(
				`BKG-${this.bookingIdCounter++}`,
				guest,
				room,
				checkInDate,
				checkOutDate,
			);

			// Calculate price using pricing strategy
			const basePrice = room.basePricePerNight;
			const numberOfNights = booking.getNumberOfNights();
			const finalPrice = pricingStrategy.calculatePrice(
				basePrice,
				numberOfNights,
			);
			booking.totalPrice = finalPrice;

			console.log(`\n BOOKING SUMMARY`);
			console.log(`   Booking ID: ${booking.bookingId}`);
			console.log(`   Guest: ${guest.name}`);
			console.log(`   Room: ${room.getRoomType()} (${room.roomNumber})`);
			console.log(`   Check-in: ${checkInDate.toLocaleDateString()}`);
			console.log(`   Check-out: ${checkOutDate.toLocaleDateString()}`);
			console.log(`   Number of Nights: ${numberOfNights}`);
			console.log(`   Base Price: $${basePrice.toFixed(2)}/night`);
			console.log(`   Pricing Strategy: ${pricingStrategy.getStrategyName()}`);
			console.log(`   Final Price: $${finalPrice.toFixed(2)}`);

			// Process payment using payment strategy
			console.log(`\n PAYMENT PROCESSING`);
			const paymentSuccess = paymentStrategy.processPayment(finalPrice);

			if (paymentSuccess) {
				// Confirm booking
				booking.confirm();
				this.bookings.push(booking);

				// Send confirmation notification using notification strategy
				const message = `Your booking (${booking.bookingId}) for ${guest.name} at ${room.getRoomType()} has been confirmed. Total: $${finalPrice.toFixed(2)}`;
				notificationStrategy.sendNotification(
					guest.email,
					'Booking Confirmation',
					message,
				);

				console.log(`\n BOOKING CONFIRMED: ${booking.bookingId}`);
				return booking;
			} else {
				console.log(`\n BOOKING FAILED: Payment unsuccessful`);
				return null;
			}
		} catch (error) {
			console.log(` Error creating booking: ${error}`);
			return null;
		}
	}

	/**
	 * Cancels a booking
	 */
	cancelBooking(
		bookingId: string,
		notificationStrategy: NotificationStrategy,
	): boolean {
		const booking = this.bookings.find((b) => b.bookingId === bookingId);

		if (!booking) {
			console.log(` Booking ${bookingId} not found`);
			return false;
		}

		booking.cancel();
		const message = `Your booking (${bookingId}) has been cancelled. Refund will be processed within 5-7 business days.`;
		notificationStrategy.sendNotification(
			booking.guest.email,
			'Booking Cancellation',
			message,
		);

		console.log(` Booking ${bookingId} cancelled successfully`);
		return true;
	}

	/**
	 * Gets all bookings
	 */
	getAllBookings(): Booking[] {
		return [...this.bookings];
	}

	/**
	 * Gets booking by ID
	 */
	getBooking(bookingId: string): Booking | undefined {
		return this.bookings.find((b) => b.bookingId === bookingId);
	}

	/**
	 * Gets bookings for a specific guest
	 */
	getGuestBookings(guestId: string): Booking[] {
		return this.bookings.filter((b) => b.guest.guestId === guestId);
	}

	/**
	 * Gets available rooms
	 */
	getAvailableRooms(rooms: Room[]): Room[] {
		return rooms.filter((r) => r.isAvailable);
	}
}
