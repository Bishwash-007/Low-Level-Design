// Common interface for all notification types
public interface Notification {
    void sendNotification(String message);
}

public class EmailNotification implements Notification {
    @Override
    public void sendNotification(String message) {
        System.out.println("Sending Email Notification: " + message);
    }
}

public class SMSNotification implements Notification {
    @Override
    public void sendNotification(String message) {
        System.out.println("Sending SMS Notification: " + message);
    }
}