import { EmailNotificationCreator, SMSNotificationCreator } from './creators';

function main() {
	// Using Email Notification
	const emailSender = new EmailNotificationCreator();
	emailSender.sendNotification();

	// Using SMS Notification
	const smsSender = new SMSNotificationCreator();
	smsSender.sendNotification();

}

main();
