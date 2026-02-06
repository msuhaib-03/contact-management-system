# contact-management-system
## Overview

The Contact Management System is a secure full‑stack web application that allows users to register, authenticate, and manage their personal contacts in a centralized digital address book. The application focuses on security, scalability, and clean API architecture using modern Spring Boot and React tooling.

Users can securely store, update, search, and delete contacts while authentication is handled through JWT based authorization. The system also implements token invalidation and password management features to ensure account safety.

---

## Key Features

* User Registration & Login (JWT Authentication)
* Change Password & Secure Session Handling
* Token Blacklisting (Logout Protection)
* Add / Update / Delete Contacts
* Search & Filter Contacts
* Role‑based Security Configuration
* RESTful API Architecture
* Exception Handling & Validation
* Unit & Controller Test Support

---

## Technology Stack

### Backend

* Java 17
* Spring Boot 4.x
* Spring Security (JWT Authentication)
* Spring Data JPA
* Hibernate ORM
* Microsoft SQL Server
* Maven

### Frontend

* React.js
* Vite
* Axios
* Tailwind / CSS

### Testing

* JUnit 5
* Mockito
* Spring Boot Test
* Spring Security Test

---

## Project Architecture

The project follows a layered architecture:

Controller Layer → Handles HTTP Requests
Service Layer → Business Logic & Validation
Repository Layer → Database Communication (JPA)
Security Layer → JWT Filters & Authentication
Exception Layer → Global Error Handling

---

## Prerequisites

Before running the project ensure the following are installed:

* Java JDK 17+
* Maven 3.9+
* Node.js 18+
* npm 9+
* SQL Server (or configured database)
* Git

---

## Environment Configuration

Update the `application.properties` file inside backend:

```
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=contacts_db;encrypt=true;trustServerCertificate=true
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
jwt.secret=yourSecretKeyHere
```

---

## Backend Setup & Run

1. Navigate to backend project folder

```
cd backend
```

2. Build the project

```
mvn clean package
```

3. Run the generated JAR

```
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

Server will start on:

```
http://localhost:8080
```

---

## Frontend Setup & Run

1. Navigate to frontend folder

```
cd frontend
```

2. Install dependencies

```
npm install
```

3. Run development server

```
npm run dev
```

Frontend will start on:

```
http://localhost:5173
```

---

## Authentication Flow

1. User logs in using email and password
2. Server verifies credentials
3. JWT token is generated and returned
4. Frontend stores token
5. Token sent in Authorization header for protected endpoints
6. On logout token is added to blacklist

---

## API Example

### Change Password

POST `/change-password`

Request:

```
{
  "oldPassword": "old123",
  "newPassword": "new123"
}
```

Response:

```
Password updated successfully
```

---

## Running Tests

```
mvn test
```

---

## Security Highlights

* Password hashing using BCrypt
* Stateless authentication (JWT)
* Token blacklist protection
* Authentication via Spring Security filters
* Global exception handling

---

## Author

Muhammad Suhaib

---

## License

This project is for educational and demonstration purposes.
