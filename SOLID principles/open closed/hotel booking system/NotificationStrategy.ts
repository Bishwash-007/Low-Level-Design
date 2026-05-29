/**
 * NOTIFICATION STRATEGY - OPEN/CLOSED PRINCIPLE
 *
 * The NotificationStrategy interface is CLOSED for modification
 * We can add new notification methods by implementing NotificationStrategy
 * without modifying the BookingService
 */

/**
 * Abstract Notification Strategy
 * Responsibility: Define the contract for sending notifications
 *
 * This is CLOSED for modification - it defines the interface
 * This is OPEN for extension - new notification types can implement this
 */
export interface NotificationStrategy {
	sendNotification(
		recipient: string,
		subject: string,
		message: string,
	): boolean;
	getNotificationType(): string;
}

/**
 * Email Notification - IMPLEMENTATION of NotificationStrategy
 */
export class EmailNotification implements NotificationStrategy {
	sendNotification(
		recipient: string,
		subject: string,
		message: string,
	): boolean {
		console.log(`\n EMAIL NOTIFICATION`);
		console.log(`   To: ${recipient}`);
		console.log(`   Subject: ${subject}`);
		console.log(`   Message: ${message}`);
		console.log(`   Status: Sent`);
		return true;
	}

	getNotificationType(): string {
		return 'Email';
	}
}

/**
 * SMS Notification - IMPLEMENTATION of NotificationStrategy
 */
export class SmsNotification implements NotificationStrategy {
	sendNotification(
		recipient: string,
		subject: string,
		message: string,
	): boolean {
		console.log(`\n SMS NOTIFICATION`);
		console.log(`   To: ${this.maskPhoneNumber(recipient)}`);
		console.log(`   Message: ${message.substring(0, 50)}...`);
		console.log(`   Status:  Sent`);
		return true;
	}

	getNotificationType(): string {
		return 'SMS';
	}

	private maskPhoneNumber(phone: string): string {
		return `****${phone.slice(-4)}`;
	}
}

/**
 * Push Notification - IMPLEMENTATION of NotificationStrategy
 */
export class PushNotification implements NotificationStrategy {
	sendNotification(
		recipient: string,
		subject: string,
		message: string,
	): boolean {
		console.log(`\n PUSH NOTIFICATION`);
		console.log(`   Device: ${recipient}`);
		console.log(`   Title: ${subject}`);
		console.log(`   Message: ${message}`);
		console.log(`   Status:  Sent`);
		return true;
	}

	getNotificationType(): string {
		return 'Push Notification';
	}
}

/**
 * WhatsApp Notification - IMPLEMENTATION of NotificationStrategy
 * Easy to add new notification channel without modifying anything
 */
export class WhatsAppNotification implements NotificationStrategy {
	sendNotification(
		recipient: string,
		subject: string,
		message: string,
	): boolean {
		console.log(`\n WHATSAPP NOTIFICATION`);
		console.log(`   To: ${this.maskPhoneNumber(recipient)}`);
		console.log(`   Message: ${message.substring(0, 50)}...`);
		console.log(`   Status:  Sent`);
		return true;
	}

	getNotificationType(): string {
		return 'WhatsApp';
	}

	private maskPhoneNumber(phone: string): string {
		return `+1****${phone.slice(-3)}`;
	}
}

/**
 * Telegram Notification - IMPLEMENTATION of NotificationStrategy
 */
export class TelegramNotification implements NotificationStrategy {
	sendNotification(
		recipient: string,
		subject: string,
		message: string,
	): boolean {
		console.log(`\n TELEGRAM NOTIFICATION`);
		console.log(`   Chat ID: ${recipient}`);
		console.log(`   Message: ${message.substring(0, 50)}...`);
		console.log(`   Status:  Sent`);
		return true;
	}

	getNotificationType(): string {
		return 'Telegram';
	}
}

/**
 * Slack Notification - IMPLEMENTATION of NotificationStrategy
 */
export class SlackNotification implements NotificationStrategy {
	sendNotification(
		recipient: string,
		subject: string,
		message: string,
	): boolean {
		console.log(`\n SLACK NOTIFICATION`);
		console.log(`   Channel: ${recipient}`);
		console.log(`   Title: ${subject}`);
		console.log(`   Message: ${message.substring(0, 50)}...`);
		console.log(`   Status:  Sent`);
		return true;
	}

	getNotificationType(): string {
		return 'Slack';
	}
}
