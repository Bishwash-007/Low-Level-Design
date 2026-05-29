/**
 * HOTEL BOOKING SYSTEM - OPEN/CLOSED PRINCIPLE DEMONSTRATION
 *
 * This system demonstrates the Open/Closed Principle:
 * - CLOSED for modification: BookingService doesn't change when adding new features
 * - OPEN for extension: New room types, payment methods, pricing strategies, and notifications
 *   can be added without modifying existing code
 */

import {
	Room,
	StandardRoom,
	DeluxeRoom,
	SuiteRoom,
	BudgetRoom,
	Penthouse,
} from './Room';
import { Booking, Guest } from './Booking';
import { BookingService } from './BookingService';
import {
	PaymentStrategy,
	CreditCardPayment,
	DigitalWalletPayment,
	BankTransferPayment,
	ApplePayPayment,
	GooglePayPayment,
} from './PaymentStrategy';
import {
	PricingStrategy,
	StandardPricing,
	EarlyBirdPricing,
	WeekendSurchargePricing,
	LongStayPricing,
	SeasonalPricing,
} from './PricingStrategy';
import {
	NotificationStrategy,
	EmailNotification,
	SmsNotification,
	PushNotification,
	WhatsAppNotification,
	TelegramNotification,
} from './NotificationStrategy';

console.log('HOTEL BOOKING SYSTEM - OPEN/CLOSED PRINCIPLE DEMONSTRATION\n');
console.log(
	'The system is CLOSED for modification but OPEN for extension through strategies.\n',
);

//  Initialize Service 
const bookingService = new BookingService();

//  Create Hotel Rooms 
console.log('--- AVAILABLE ROOMS ---');
const rooms: Room[] = [
	new BudgetRoom('101'),
	new StandardRoom('102'),
	new StandardRoom('103'),
	new DeluxeRoom('201'),
	new DeluxeRoom('202'),
	new SuiteRoom('301'),
	new Penthouse('401'),
];

rooms.forEach((room) => {
	console.log(
		`   ${room.roomNumber}: ${room.getRoomType()} - $${room.basePricePerNight}/night`,
	);
});

//  Create Guests 
const guest1 = new Guest(
	'G001',
	'Alice Johnson',
	'alice@email.com',
	'555-1234',
	2,
);
const guest2 = new Guest('G002', 'Bob Smith', 'bob@email.com', '555-5678', 3);

//  BOOKING 1: Standard Booking with Credit Card 
console.log(
	'\n BOOKING 1: Standard Booking ',
);
const checkIn1 = new Date('2026-06-15');
const checkOut1 = new Date('2026-06-18');
const payment1: PaymentStrategy = new CreditCardPayment(
	'4111111111111111',
	'Alice Johnson',
	'123',
);
const pricing1: PricingStrategy = new StandardPricing();
const notification1: NotificationStrategy = new EmailNotification();

bookingService.createBooking(
	guest1,
	rooms[1], // Standard Room 102
	checkIn1,
	checkOut1,
	payment1,
	pricing1,
	notification1,
);

//  BOOKING 2: Early Bird Discount with Digital Wallet 
console.log(
	'\n BOOKING 2: Early Bird Booking ',
);
const checkIn2 = new Date('2026-09-01');
const checkOut2 = new Date('2026-09-08');
const payment2: PaymentStrategy = new DigitalWalletPayment('bob@paypal.com');
const pricing2: PricingStrategy = new EarlyBirdPricing(45); // 45 days in advance
const notification2: NotificationStrategy = new WhatsAppNotification();

bookingService.createBooking(
	guest2,
	rooms[4], // Deluxe Room 202
	checkIn2,
	checkOut2,
	payment2,
	pricing2,
	notification2,
);

//  BOOKING 3: Long Stay with Member Loyalty 
console.log(
	'\n BOOKING 3: Long Stay Booking ',
);
const guest3 = new Guest(
	'G003',
	'Carol White',
	'carol@email.com',
	'555-9999',
	2,
);
const checkIn3 = new Date('2026-07-01');
const checkOut3 = new Date('2026-07-31');
const payment3: PaymentStrategy = new ApplePayPayment('device-token-12345');
const pricing3: PricingStrategy = new LongStayPricing();
const notification3: NotificationStrategy = new SmsNotification();

bookingService.createBooking(
	guest3,
	rooms[5], // Suite Room 301
	checkIn3,
	checkOut3,
	payment3,
	pricing3,
	notification3,
);

//  BOOKING 4: Weekend with Bank Transfer 
console.log(
	'\n BOOKING 4: Weekend Booking ',
);
const guest4 = new Guest(
	'G004',
	'David Brown',
	'david@email.com',
	'555-4321',
	4,
);
const checkIn4 = new Date('2026-06-20'); // Saturday
const checkOut4 = new Date('2026-06-22'); // Monday
const payment4: PaymentStrategy = new BankTransferPayment(
	'9876543210',
	'Chase Bank',
);
const pricing4: PricingStrategy = new WeekendSurchargePricing(true);
const notification4: NotificationStrategy = new PushNotification();

bookingService.createBooking(
	guest4,
	rooms[6], // Penthouse 401
	checkIn4,
	checkOut4,
	payment4,
	pricing4,
	notification4,
);

//  BOOKING 5: Seasonal Booking with Multiple Notifications 
console.log(
	'\n BOOKING 5: Peak Season Booking ',
);
const guest5 = new Guest('G005', 'Eve Davis', 'eve@email.com', '555-5555', 2);
const checkIn5 = new Date('2026-12-20'); // Peak season
const checkOut5 = new Date('2026-12-27');
const payment5: PaymentStrategy = new GooglePayPayment('eve@gmail.com');
const pricing5: PricingStrategy = new SeasonalPricing('peak');
const notification5: NotificationStrategy = new TelegramNotification();

bookingService.createBooking(
	guest5,
	rooms[2], // Standard Room 103
	checkIn5,
	checkOut5,
	payment5,
	pricing5,
	notification5,
);

//  Display All Bookings 
console.log('\n ALL BOOKINGS ');
const allBookings = bookingService.getAllBookings();
console.log(`\nTotal Bookings: ${allBookings.length}`);
allBookings.forEach((booking) => {
	console.log(`\nBooking ID: ${booking.bookingId}`);
	console.log(`Guest: ${booking.guest.name}`);
	console.log(`Room: ${booking.room.getRoomType()}`);
	console.log(`Status: ${booking.status}`);
	console.log(`Total Price: $${booking.totalPrice.toFixed(2)}`);
});

console.log('\n Open/Closed Principle Successfully Demonstrated!');
console.log('\n KEY POINTS:');
console.log('BookingService is CLOSED for modification');
console.log('System is OPEN for extension through strategies');
console.log('New payment methods added without changing BookingService');
console.log(
	'New pricing strategies added without changing BookingService',
);
console.log(
	'New notification channels added without changing BookingService',
);
console.log('New room types added without changing BookingService');
