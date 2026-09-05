# THE GRIND – Habit Challenge Club
### Full-Stack Java Mini Project (Servlets, JSP, JDBC, MySQL, Multithreading & OOP)

---

## 📖 1. Project Overview
**The Grind – Habit Challenge Club** is a complete, production-ready college-level Java full-stack web application designed for students and professionals to build daily discipline through habit stacks, streak preservation, interactive progress tracking, and an intelligent **Grind Coach** chatbot.

The application follows the industry-standard **Model-View-Controller (MVC)** design pattern, featuring:
- **Model:** Java Beans and POJOs implementing Encapsulation and Polymorphic Interfaces.
- **View:** Dynamic JSP (JavaServer Pages) with JSTL tags, CSS design system (soft green aesthetic), and Vanilla JS DOM manipulation.
- **Controller:** Java Servlets handling HTTP GET/POST, sessions, and request dispatching.
- **Data Access:** JDBC DAOs utilizing `PreparedStatement` to defend against SQL Injection.
- **Background Daemon:** Multithreaded `ReminderCheckerThread` managing asynchronous reminders.

---

## 🎓 2. JAVA SYLLABUS CONCEPTS USED IN "THE GRIND"

| # | Syllabus Requirement | Concept Description | Implementation in The Grind |
|---|---|---|---|
| 1 | **Basic Programming in Java** | Data types, operators, naming conventions, expressions | Used throughout all models (`int`, `boolean`, `String`, `double`) |
| 2 | **OOP: Classes & Objects** | Class definitions, object instantiation, state and behavior | `Person`, `User`, `Habit`, `Reminder`, `Progress`, `ChatMessage` |
| 3 | **Encapsulation** | Private instance variables with public getters/setters | All classes in `com.thegrind.model` encapsulate their attributes |
| 4 | **Abstraction** | Abstract classes, abstract methods, contract definition | `com.thegrind.model.Person`, `com.thegrind.service.AbstractService` |
| 5 | **Inheritance** | Class hierarchy using `extends` keyword | `User extends Person`, `UserService extends AbstractService` |
| 6 | **Polymorphism** | Runtime polymorphic method invocation | `ChatbotStrategy` implementations (`MotivationStrategy`, `MissedHabitStrategy`, etc.) |
| 7 | **Message Passing** | Invoking methods across objects to communicate | Servlets invoke Service methods; Services invoke DAO methods |
| 8 | **Branching & Looping** | `if/else`, `switch`, `for`, `while`, enhanced `for-each` | `ChatbotService.detectIntent()`, `CompletionDAO.getWeeklyDayPercentages()` |
| 9 | **Constructors** | Default and parameterized constructors, constructor chaining | `Habit()`, `Habit(int, String, String, int, String)`, `User(String, String, String)` |
| 10 | **Instance vs Static Members** | `static` constants and methods vs instance fields | `DBConnection.getInstance()`, `ValidationUtil.validateEmail()`, `User.totalUsersCount` |
| 11 | **Method Overloading** | Same method name with different parameter signatures | `ValidationUtil.validateHabit(name)`, `ValidationUtil.validateHabit(name, target, unit)` |
| 12 | **Input/Output (I/O)** | Reading properties files, streaming responses | `DBConnection` reads `db.properties` via `InputStream` |
| 13 | **Packages** | Modular code organization | `com.thegrind.model`, `dao`, `service`, `servlet`, `util`, `exception`, `thread` |
| 14 | **Java Arrays & Vectors** | Standard arrays and synchronized `java.util.Vector` | `HabitDAO.getUserHabitsVector()`, `HabitDAO.getUserHabitsArray()`, `Progress.dailyPercentages[]` |
| 15 | **Method Overriding** | Subclass overriding parent method behavior | `User.getDisplayName()`, `User.authenticate()`, `UserService.isOperational()` |
| 16 | **super Keyword** | Calling superclass constructors and methods | `super(fullName, email, passwordHash)` in `User` constructor |
| 17 | **final Keyword** | Immutable constants, final classes, non-overridable methods | `AbstractService.logAction()`, `DBConnection.PROPERTIES_FILE` |
| 18 | **Multiple Inheritance via Interfaces** | Implementing multiple contracts | `User implements Authenticatable, Trackable` |
| 19 | **Exception Handling** | `try`, `catch`, `finally`, `throw`, `throws` | Robust resource cleanup and safety in `DBConnection.closeResources()` |
| 20 | **Multiple try/catch Blocks** | Catching distinct checked and runtime exceptions | `UserService.registerUser()`, `DBConnection.getConnection()` |
| 21 | **Custom User Exceptions** | Exception hierarchy extending custom base | `TheGrindException`, `InvalidUserException`, `InvalidHabitException`, `DatabaseException` |
| 22 | **Multithreading in Java** | Background threads, `Runnable`, concurrency safety | `ReminderCheckerThread implements Runnable`, managed by `AppContextListener` |
| 23 | **JDBC Connection** | Singleton connection manager | `com.thegrind.util.DBConnection` |
| 24 | **MySQL Database & SQL** | Relational tables, foreign keys, cascade deletes, constraints | `src/main/resources/schema.sql` (8 structured tables) |
| 25 | **SQL Queries** | `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`, `COUNT` | `CompletionDAO`, `HabitDAO`, `UserDAO` |
| 26 | **PreparedStatement** | SQL Injection defense and parameter binding | Used 100% across all DAO classes |
| 27 | **HTML5 & CSS3** | Semantic markup, responsive design, soft green theme | `webapp/*.jsp`, `webapp/css/style.css` |
| 28 | **JavaScript & DOM** | Dynamic DOM updates, event listeners, AJAX | `webapp/js/main.js`, `webapp/js/chatbot.js` |
| 29 | **Browser Object Model (BOM)** | `window.location`, `window.history`, `localStorage` | Toast alerts, URL search param parsing in `main.js` |
| 30 | **Web Architecture** | Client-Server, MVC, Request-Response, Sessions | `javax.servlet.http.HttpServlet`, `HttpSession`, `AuthenticationFilter` |
| 31 | **Chatbot Integration** | "Grind Coach" habit advisor | `ChatbotService`, `ChatbotServlet`, `ChatbotStrategy` |

---

## 🗄️ 3. Database Setup (MySQL)

1. Ensure MySQL Server (version 8.0 or 5.7) is running.
2. Open MySQL Workbench or command line:
   ```bash
   mysql -u root -p
   ```
3. Execute the provided `schema.sql`:
   ```sql
   SOURCE src/main/resources/schema.sql;
   ```
4. Configure your credentials in `src/main/resources/db.properties`:
   ```properties
   db.url=jdbc:mysql://localhost:3306/the_grind_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   db.user=root
   db.password=your_password_here
   ```

---

## 🚀 4. How to Run the Application

### Option A: Eclipse IDE for Enterprise Java (Recommended for College Lab)
1. Open Eclipse -> **File** -> **Import** -> **Existing Maven Projects**.
2. Select the `TheGrind` folder.
3. Right-click project -> **Build Path** -> **Configure Build Path** -> Ensure Java 8 or higher is selected.
4. Right-click project -> **Run As** -> **Run on Server** -> Select **Apache Tomcat v9.0 / v10.0**.
5. Eclipse will deploy the application and open: `http://localhost:8080/TheGrind/`

### Option B: Apache Tomcat Manual Deployment
1. Build the WAR package using Maven:
   ```bash
   mvn clean package
   ```
2. Copy `target/TheGrind.war` to your Tomcat `webapps/` folder.
3. Start Tomcat:
   ```bash
   bin/startup.sh  # or bin/startup.bat on Windows
   ```
4. Access in your browser: `http://localhost:8080/TheGrind/`

### Option C: IntelliJ IDEA Ultimate
1. **File** -> **Open** -> select `TheGrind/pom.xml`.
2. Configure Tomcat Server in **Run/Debug Configurations**.
3. Deploy `TheGrind:war exploded` artifact.
4. Click **Run**.

---

## 📂 5. Directory Structure
```
TheGrind/
├── pom.xml
├── README.md
└── src/
    └── main/
        ├── java/com/thegrind/
        │   ├── dao/           # JDBC Data Access Objects (UserDAO, HabitDAO, GoalDAO, CompletionDAO, ReminderDAO, NotificationDAO, ChatbotDAO)
        │   ├── exception/     # Custom Exception classes (InvalidUserException, InvalidHabitException, DatabaseException)
        │   ├── filter/        # AuthenticationFilter (Session security)
        │   ├── interfaces/    # OOP Interfaces (Authenticatable, Trackable, NotificationService, ChatbotStrategy)
        │   ├── listener/      # AppContextListener (Multithreaded background lifecycle)
        │   ├── model/         # Domain POJOs (Person, User, Habit, Goal, Reminder, Notification, Progress, ChatMessage)
        │   ├── service/       # Business Logic & Strategies (UserService, HabitService, ProgressService, ChatbotService)
        │   ├── servlet/       # Controller Servlets (RegisterServlet, LoginServlet, DashboardServlet, HabitServlet, etc.)
        │   ├── thread/        # Multithreading daemon (ReminderCheckerThread)
        │   └── util/          # Utilities (DBConnection, PasswordUtil, ValidationUtil, DateUtil)
        ├── resources/
        │   ├── db.properties  # JDBC credentials
        │   └── schema.sql     # MySQL database tables and seed records
        └── webapp/
            ├── WEB-INF/
            │   └── web.xml    # Deployment descriptor & servlet mappings
            ├── css/
            │   └── style.css  # Soft green aesthetic design system
            ├── js/
            │   ├── main.js    # DOM manipulation & AJAX habit toggle
            │   └── chatbot.js # Grind Coach floating drawer
            ├── index.jsp      # Landing page ("Small steps. Big changes.")
            ├── login.jsp      # Sign in form
            ├── register.jsp   # Registration form
            ├── onboarding.jsp # Goals selection
            ├── select-habits.jsp # Habit stack picker & custom habit creator
            ├── reminders.jsp  # Daily reminder time setup
            ├── dashboard.jsp  # Core dashboard with streak, habits & coach
            ├── habit-details.jsp # Habit details & 7-day history
            ├── progress.jsp   # Weekly Mon-Sun analytics
            ├── profile.jsp    # User profile & stats
            ├── settings.jsp   # Preferences & logout
            └── error.jsp      # Error display page
```
