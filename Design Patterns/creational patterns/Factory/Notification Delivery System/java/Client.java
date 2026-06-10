public class Client {
    public static void main(String[] args) {
        // Using Email Notification
        NotificationSender emailSender = new EmailSender();
        emailSender.sendAlert("This is an email notification!");

        // Using SMS Notification
        NotificationSender smsSender = new SMSSender();
        smsSender.sendAlert("This is an SMS notification!");
    }
}
