// ========== SOLID PRINCIPLES GUIDE - SPRING BOOT JAVA ==========

// ============ S: SINGLE RESPONSIBILITY PRINCIPLE ============
// Definition: A class should have only one reason to change
// Benefit: Easier to maintain, test, and modify

//  VIOLATION: UserService does too much
@Service
public class UserServiceBad {
    private final UserRepository userRepository;
    private final JavaMailSender emailSender;
    private final DataSource dataSource;
    
    public void createUser(User user) throws Exception {
        // Validation logic
        if (user.getEmail() == null) throw new Exception("Email required");
        
        // Database logic
        userRepository.save(user);
        
        // Email logic
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Welcome!");
        message.setText("Your account has been created");
        emailSender.send(message);
        
        // Logging to database
        Connection conn = dataSource.getConnection();
        conn.createStatement().execute("INSERT INTO audit_log VALUES (...)");
        
        // SMS notification
        sendSMS(user.getPhone());
    }
    
    private void sendSMS(String phone) { /* ... */ }
}

//  SOLUTION: Separate concerns into different services
@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final NotificationService notificationService;
    
    @Transactional
    public void createUser(User user) {
        userValidator.validate(user); // Validation
        userRepository.save(user);    // Persistence
        notificationService.notifyUserCreated(user); // Notification
    }
}

@Component
public class UserValidator {
    public void validate(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new ValidationException("Email is required");
        }
        if (user.getPhone() == null || user.getPhone().isBlank()) {
            throw new ValidationException("Phone is required");
        }
    }
}

@Service
public class NotificationService {
    private final EmailService emailService;
    private final SMSService smsService;
    private final AuditService auditService;
    
    public void notifyUserCreated(User user) {
        emailService.sendWelcomeEmail(user);
        smsService.sendWelcomeSMS(user);
        auditService.logUserCreation(user);
    }
}

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    
    public void sendWelcomeEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Welcome!");
        message.setText("Your account created");
        mailSender.send(message);
    }
}

// Benefit: Easy to test each service independently
// Benefit: Easy to add new notification channels
// Benefit: Each service has one reason to change

// ============ O: OPEN/CLOSED PRINCIPLE ============
// Definition: Open for extension, closed for modification
// Benefit: Add features without changing existing code

//  VIOLATION: Adding new report type requires modifying ReportGenerator
@Service
public class ReportGeneratorBad {
    public String generateReport(String type, List<Order> orders) {
        if (type.equals("PDF")) {
            return generatePDFReport(orders);
        } else if (type.equals("CSV")) {
            return generateCSVReport(orders);
        } else if (type.equals("JSON")) {
            return generateJSONReport(orders);
        }
        return "";
    }
    
    private String generatePDFReport(List<Order> orders) { /* ... */ return ""; }
    private String generateCSVReport(List<Order> orders) { /* ... */ return ""; }
    private String generateJSONReport(List<Order> orders) { /* ... */ return ""; }
}

//  SOLUTION: Use strategy pattern for extensibility
public interface ReportGenerator {
    String generate(List<Order> orders);
}

@Component
public class PDFReportGenerator implements ReportGenerator {
    @Override
    public String generate(List<Order> orders) {
        // PDF generation logic
        return "PDF Report";
    }
}

@Component
public class CSVReportGenerator implements ReportGenerator {
    @Override
    public String generate(List<Order> orders) {
        // CSV generation logic
        return "CSV Report";
    }
}

@Component
public class ExcelReportGenerator implements ReportGenerator {
    @Override
    public String generate(List<Order> orders) {
        // Excel generation logic
        return "Excel Report";
    }
}

@Service
public class ReportService {
    private final Map<String, ReportGenerator> generators;
    
    public ReportService(Map<String, ReportGenerator> generators) {
        this.generators = generators;
    }
    
    public String generateReport(String type, List<Order> orders) {
        ReportGenerator generator = generators.get(type);
        if (generator == null) {
            throw new IllegalArgumentException("Unknown report type: " + type);
        }
        return generator.generate(orders);
    }
}

// Benefit: Add new report type without modifying ReportService
// Benefit: Each generator is independent and testable
// Benefit: Follows Strategy pattern

// ============ L: LISKOV SUBSTITUTION PRINCIPLE ============
// Definition: Subtypes must be substitutable for their base types
// Benefit: Predictable polymorphism, correct type hierarchies

//  VIOLATION: ElectricCar violates Vehicle interface
public interface Vehicle {
    void accelerate();
    void refuel();
    double getFuelLevel();
}

public class GasolineCar implements Vehicle {
    private double fuel;
    
    @Override
    public void accelerate() {
        fuel -= 0.5;
    }
    
    @Override
    public void refuel() {
        fuel = 100;
    }
    
    @Override
    public double getFuelLevel() {
        return fuel;
    }
}

public class ElectricCarBad implements Vehicle {
    private double battery;
    
    @Override
    public void accelerate() {
        battery -= 0.3;
    }
    
    @Override
    public void refuel() {
        throw new UnsupportedOperationException("ElectricCar does not refuel!");
    }
    
    @Override
    public double getFuelLevel() {
        throw new UnsupportedOperationException("ElectricCar has battery, not fuel!");
    }
}

//  SOLUTION: Create correct hierarchy
public interface Vehicle {
    void accelerate();
    double getEnergyLevel();
}

public class GasolineCar implements Vehicle {
    private double fuel;
    
    @Override
    public void accelerate() {
        fuel -= 0.5;
    }
    
    @Override
    public double getEnergyLevel() {
        return fuel;
    }
    
    public void refuel() {
        fuel = 100;
    }
}

public class ElectricCar implements Vehicle {
    private double battery;
    
    @Override
    public void accelerate() {
        battery -= 0.3;
    }
    
    @Override
    public double getEnergyLevel() {
        return battery;
    }
    
    public void recharge() {
        battery = 100;
    }
}

@Service
public class RentalService {
    public void rentVehicle(Vehicle vehicle) {
        // Both GasolineCar and ElectricCar are substitutable
        for (int i = 0; i < 10; i++) {
            vehicle.accelerate();
        }
        System.out.println("Energy level: " + vehicle.getEnergyLevel());
    }
}

// Benefit: Vehicle interface works correctly for all implementations
// Benefit: No runtime surprises from UnsupportedOperationException

// ============ I: INTERFACE SEGREGATION PRINCIPLE ============
// Definition: Clients should depend on specific interfaces, not general ones
// Benefit: Loose coupling, flexible implementations

//  VIOLATION: Printer interface has too many methods
public interface Printer {
    void print(String document);
    void scan(String filename);
    void fax(String phoneNumber);
    void copy();
    boolean hasWifi();
}

public class BasicPrinterBad implements Printer {
    @Override
    public void print(String document) { /* ... */ }
    
    @Override
    public void scan(String filename) {
        throw new UnsupportedOperationException("Not supported");
    }
    
    @Override
    public void fax(String phoneNumber) {
        throw new UnsupportedOperationException("Not supported");
    }
    
    @Override
    public void copy() {
        throw new UnsupportedOperationException("Not supported");
    }
    
    @Override
    public boolean hasWifi() {
        return false;
    }
}

//  SOLUTION: Segregate interfaces by capability
public interface Printer {
    void print(String document);
}

public interface Scanner {
    void scan(String filename);
}

public interface Fax {
    void fax(String phoneNumber);
}

public interface Copier {
    void copy();
}

public interface WiFiCapable {
    boolean hasWifi();
}

public class BasicPrinter implements Printer {
    @Override
    public void print(String document) {
        System.out.println("Printing: " + document);
    }
}

public class MultifunctionPrinter implements Printer, Scanner, Fax, Copier, WiFiCapable {
    @Override
    public void print(String document) { /* ... */ }
    @Override
    public void scan(String filename) { /* ... */ }
    @Override
    public void fax(String phoneNumber) { /* ... */ }
    @Override
    public void copy() { /* ... */ }
    @Override
    public boolean hasWifi() { return true; }
}

@Service
public class PrintingService {
    public void processPrinter(Printer printer) {
        printer.print("document.txt"); // Works for all Printer implementations
    }
    
    public void processScanner(Scanner scanner) {
        scanner.scan("scan.pdf");
    }
}

// Benefit: BasicPrinter only implements what it needs
// Benefit: No throwing UnsupportedOperationException

// ============ D: DEPENDENCY INVERSION PRINCIPLE ============
// Definition: Depend on abstractions, not concretions
// Benefit: Flexible, testable, maintainable code

//  VIOLATION: Service directly depends on concrete implementation
@Service
public class UserServiceBadDI {
    private final MySQLUserRepository userRepository = new MySQLUserRepository();
    private final GmailNotificationService notificationService = new GmailNotificationService();
    
    public void createUser(User user) {
        userRepository.save(user);
        notificationService.send("User created");
    }
}

// Problem: Cannot test with mock repository
// Problem: Cannot change database or email provider
// Problem: Tightly coupled

//  SOLUTION: Depend on interfaces (abstractions)
public interface UserRepository {
    void save(User user);
    User findById(Long id);
}

public interface NotificationService {
    void send(String message);
}

@Component
public class MySQLUserRepository implements UserRepository {
    private final JdbcTemplate jdbcTemplate;
    
    @Override
    public void save(User user) {
        // MySQL implementation
    }
    
    @Override
    public User findById(Long id) {
        // MySQL implementation
        return null;
    }
}

@Component
public class PostgresUserRepository implements UserRepository {
    private final JdbcTemplate jdbcTemplate;
    
    @Override
    public void save(User user) {
        // PostgreSQL implementation
    }
    
    @Override
    public User findById(Long id) {
        // PostgreSQL implementation
        return null;
    }
}

@Component
public class EmailNotificationService implements NotificationService {
    private final JavaMailSender mailSender;
    
    @Override
    public void send(String message) {
        // Email implementation
    }
}

@Component
public class SMSNotificationService implements NotificationService {
    @Override
    public void send(String message) {
        // SMS implementation
    }
}

@Service
public class UserService {
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public UserService(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    
    @Transactional
    public void createUser(User user) {
        userRepository.save(user);
        notificationService.send("User created: " + user.getName());
    }
}

// Easy to test with mock repository
@RunWith(SpringRunner.class)
public class UserServiceTest {
    private UserService userService;
    
    @Before
    public void setup() {
        UserRepository mockRepo = mock(UserRepository.class);
        NotificationService mockNotif = mock(NotificationService.class);
        userService = new UserService(mockRepo, mockNotif);
    }
    
    @Test
    public void testCreateUser() {
        User user = new User("John");
        userService.createUser(user);
        // Verify interactions
    }
}

// Easy to configure different implementations
@Configuration
public class AppConfig {
    @Bean
    public UserRepository userRepository() {
        return new PostgresUserRepository(); // Easy to swap
    }
    
    @Bean
    public NotificationService notificationService() {
        return new SMSNotificationService(); // Easy to swap
    }
}

// ============ SUMMARY TABLE ============
/*
Principle   | Violation                        | Solution
------------|----------------------------------|----------------------------------
SRP         | One class does too much         | Separate concerns into classes
OCP         | Modify code for new features    | Extend via inheritance/interfaces
LSP         | Subtype breaks parent contract  | Correct type hierarchies
ISP         | Force implement unwanted methods| Segregate into specific interfaces
DIP         | Depend on concrete classes      | Depend on abstractions/interfaces
*/
