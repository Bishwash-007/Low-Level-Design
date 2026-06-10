// Abstract Creator declaring the factory method
public abstract class NotificationCreator {

    // Factory method to be implemented by concrete creators
    public abstract Notification createNotification();


    // Business logic that uses the notification
    public void notifyUser(String message) {
        Notification notification = createNotification();
        notification.sendNotification(message);
    }
}

// Concrete Creator for Email Notifications
public class EmailNotificationCreator extends NotificationCreator {
    @Override
    public Notification createNotification() {
        return new EmailNotification();
    } 
}


// Concrete Creator for SMS Notifications
public class SMSNotificationCreator extends NotificationCreator {
    @Override
    public Notification createNotification() {
        return new SMSNotification();
    }
}
