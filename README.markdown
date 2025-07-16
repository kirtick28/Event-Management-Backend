# Event Management API

This is a Node.js-based REST API for managing events and user registrations, built with Express.js and MongoDB. It supports user authentication, event creation, registration, and role-based access control.

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/kirtick28/Event-Management-Backend.git
   cd Event-Management-Backend
   ```

2. **Install Dependencies**
   Ensure Node.js is installed, then run:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add the following:

   ```
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret-key>
   PORT=5000
   ```

   Replace `<your-mongodb-connection-string>` with your MongoDB URI and `<your-jwt-secret-key>` with a secure secret key for JWT.

4. **Create an Admin User**
   The API does not provide an endpoint to create an admin user directly. To create an admin, manually insert a user with the `role: 'admin'` into the MongoDB `users` collection. Example MongoDB command:

   ```javascript
   db.users.insertOne({
     name: 'Admin Name',
     email: 'admin@example.com',
     password: '<hashed-password>',
     role: 'admin',
     registeredEvents: []
   });
   ```

   Ensure the password is hashed using `bcrypt` (e.g., using a script or tool to generate a hash).

5. **Run the Application**
   Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` (or the port specified in `.env`).

## API Description

The API provides endpoints for user authentication, user management, and event management. It uses JWT for authentication and supports two roles: `user` and `admin`. Admins can create/update events and view all users, while users can register/unregister for events and update their profiles.

### Base URL

`http://localhost:5000/api`

### Authentication

- Most endpoints require a JWT token in the `Authorization` header: `Bearer <token>`.
- Tokens are generated via `/auth/signup` or `/auth/login`.

### Endpoints

#### Authentication

- **POST /auth/signup**  
  Register a new user (default role: `user`).
- **POST /auth/login**  
  Log in and receive a JWT token.

#### User Management

- **GET /user/**  
  Retrieve all users (admin only).
- **PATCH /user/**  
  Update user details (authenticated user).

#### Event Management

- **GET /event/**  
  Retrieve all events (authenticated user).
- **POST /event/**  
  Create a new event (admin only).
- **GET /event/upcoming**  
  Retrieve upcoming events with optional sorting (authenticated user).
- **GET /event/:id**  
  Retrieve a specific event by ID (authenticated user).
- **PUT /event/:id**  
  Update an event by ID (admin only).
- **POST /event/register/:eventId**  
  Register for an event (user only).
- **POST /event/unregister/:eventId**  
  Unregister from an event (user only).

## Example Requests/Responses

### 1. User Signup

**Request**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"name":"John Doe","email":"john@example.com","password":"secure123"}'
```

**Response (Success)**

```json
{
  "status": "Success",
  "token": "<jwt-token>"
}
```

**Response (Error - Email Taken)**

```json
{
  "status": "Failure",
  "message": "Email already taken"
}
```

### 2. User Login

**Request**

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"john@example.com","password":"secure123"}'
```

**Response (Success)**

```json
{
  "status": "Success",
  "token": "<jwt-token>"
}
```

**Response (Error - Invalid Credentials)**

```json
{
  "status": "Failed",
  "message": "Invalid Credentials"
}
```

### 3. Create Event (Admin Only)

**Request**

```bash
curl -X POST http://localhost:5000/api/event/ \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <admin-jwt-token>" \
-d '{"title":"Tech Conference","eventDate":"2025-08-01T10:00:00Z","location":"Virtual","capacity":100}'
```

**Response (Success)**

```json
{
  "status": "Success",
  "data": {
    "eventId": "<event-id>"
  }
}
```

**Response (Error - Unauthorized)**

```json
{
  "status": "Denied",
  "message": "Unauthorized to access the endpoint"
}
```

### 4. Register for an Event

**Request**

```bash
curl -X POST http://localhost:5000/api/event/register/<event-id> \
-H "Authorization: Bearer <user-jwt-token>"
```

**Response (Success)**

```json
{
  "status": "Success",
  "message": "Event Registered Successfully"
}
```

**Response (Error - Already Registered)**

```json
{
  "status": "Failure",
  "message": "User already Registered for this event"
}
```

### 5. Get Upcoming Events

**Request**

```bash
curl -X GET http://localhost:5000/api/event/upcoming?sortDate=asc \
-H "Authorization: Bearer <jwt-token>"
```

**Response (Success)**

```json
{
  "status": "Success",
  "data": {
    "upcomingEvents": [
      {
        "_id": "<event-id>",
        "title": "Tech Conference",
        "eventDate": "2025-08-01T10:00:00.000Z",
        "location": "Virtual",
        "capacity": 100,
        "registrations": [],
        "createdAt": "2025-07-17T02:16:00.000Z"
      }
    ]
  }
}
```

## Notes

- Ensure the MongoDB server is running before starting the application.
- Admin users must be created manually in the database, as there is no endpoint to assign the `admin` role.
- Use tools like Postman or cURL for testing API endpoints.
- All endpoints except `/auth/signup` and `/auth/login` require authentication.
