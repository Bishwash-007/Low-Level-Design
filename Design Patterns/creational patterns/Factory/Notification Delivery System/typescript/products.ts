interface Notification {
	send(): void;
}

class EmailNotification implements Notification {
	send(): void {
		console.log('Sending email notification...');
	}
}

class SMSNotification implements Notification {
	send(): void {
		console.log('Sending SMS notification...');
	}
}

class PushNotification implements Notification {
	send(): void {
		console.log('Sending push notification...');
	}
}

export { Notification, EmailNotification, SMSNotification, PushNotification };
