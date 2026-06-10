import {
	EmailNotification,
	Notification,
	PushNotification,
	SMSNotification,
} from './products';

abstract class NotificationCreator implements NotificationCreator {
	public abstract createNotification(): Notification;

	public sendNotification(): void {
		const notification = this.createNotification();
		notification.send();
	}
}

class EmailNotificationCreator extends NotificationCreator {
	public createNotification(): Notification {
		return new EmailNotification();
	}
}

class SMSNotificationCreator extends NotificationCreator {
	public createNotification(): Notification {
		return new SMSNotification();
	}
}

class PushNotificationCreator extends NotificationCreator {
	public createNotification(): Notification {
		return new PushNotification();
	}
}

export {
	NotificationCreator,
	EmailNotificationCreator,
	SMSNotificationCreator,
	PushNotificationCreator,
};
