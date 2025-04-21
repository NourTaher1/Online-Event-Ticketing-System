# API Documentation

This document provides a detailed overview of the API endpoints available in the application. Each endpoint includes its description, request/response examples, and any role-based access restrictions.

## Authentication Routes (`/api/v1`)

### POST `/register`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "userId",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### POST `/login`
- **Description**: Log in a user.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "userId",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### POST `/forgetPassword`
- **Description**: Request a password reset.
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password reset email sent"
  }
  ```

### POST `/logout`
- **Description**: Log out the user.
- **Response**:
  ```json
  {
    "message": "Logout successful"
  }
  ```

## User Routes (`/api/v1/users`)

### GET `/profile`
- **Description**: Get the logged-in user's profile.
- **Response**:
  ```json
  {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

### PUT `/profile`
- **Description**: Update the logged-in user's profile.
- **Request Body**:
  ```json
  {
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "id": "userId",
      "name": "John Updated",
      "email": "john.updated@example.com"
    }
  }
  ```

### GET `/bookings`
- **Description**: Get all bookings for the logged-in user.
- **Response**:
  ```json
  [
    {
      "id": "bookingId",
      "event": "eventId",
      "quantity": 2,
      "totalPrice": 200
    }
  ]
  ```

### Admin-only Endpoints

#### GET `/`
- **Description**: Get all users.
- **Response**:
  ```json
  [
    {
      "id": "userId",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
  ```

#### GET `/:id`
- **Description**: Get a user by ID.
- **Response**:
  ```json
  {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

#### PUT `/:id`
- **Description**: Update a user by ID.
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "email": "updated.email@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User updated successfully",
    "user": {
      "id": "userId",
      "name": "Updated Name",
      "email": "updated.email@example.com"
    }
  }
  ```

#### DELETE `/:id`
- **Description**: Delete a user by ID.
- **Response**:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

## Event Routes (`/api/v1/events`)

### GET `/`
- **Description**: Get all events.
- **Response**:
  ```json
  [
    {
      "id": "eventId",
      "title": "Tech Conference",
      "description": "A conference about technology.",
      "date": "2025-05-01T00:00:00.000Z",
      "location": "New York",
      "category": "technology",
      "ticketPrice": 100,
      "remainingTickets": 50
    }
  ]
  ```

### GET `/:id`
- **Description**: Get an event by ID.
- **Response**:
  ```json
  {
    "id": "eventId",
    "title": "Tech Conference",
    "description": "A conference about technology.",
    "date": "2025-05-01T00:00:00.000Z",
    "location": "New York",
    "category": "technology",
    "ticketPrice": 100,
    "remainingTickets": 50
  }
  ```

### POST `/`
- **Description**: Create a new event (Organizer-only).
- **Request Body**:
  ```json
  {
    "title": "Tech Conference",
    "description": "A conference about technology.",
    "date": "2025-05-01T00:00:00.000Z",
    "location": "New York",
    "category": "technology",
    "ticketPrice": 100,
    "totalTickets": 100
  }
  ```
- **Response**:
  ```json
  {
    "message": "Event created successfully",
    "event": {
      "id": "eventId",
      "title": "Tech Conference",
      "description": "A conference about technology.",
      "date": "2025-05-01T00:00:00.000Z",
      "location": "New York",
      "category": "technology",
      "ticketPrice": 100,
      "remainingTickets": 100
    }
  }
  ```

### PUT `/:id`
- **Description**: Update an event by ID (Organizer/Admin-only).
- **Request Body**:
  ```json
  {
    "title": "Updated Tech Conference",
    "description": "An updated description.",
    "date": "2025-06-01T00:00:00.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Event updated successfully",
    "event": {
      "id": "eventId",
      "title": "Updated Tech Conference",
      "description": "An updated description.",
      "date": "2025-06-01T00:00:00.000Z"
    }
  }
  ```

### DELETE `/:id`
- **Description**: Delete an event by ID (Organizer/Admin-only).
- **Response**:
  ```json
  {
    "message": "Event deleted successfully"
  }
  ```

## Booking Routes (`/api/v1/bookings`)

### POST `/`
- **Description**: Create a new booking.
- **Request Body**:
  ```json
  {
    "event": "eventId",
    "quantity": 2
  }
  ```
- **Response**:
  ```json
  {
    "message": "Booking created successfully",
    "booking": {
      "id": "bookingId",
      "event": "eventId",
      "quantity": 2,
      "totalPrice": 200
    }
  }
  ```

### GET `/:id`
- **Description**: Get a booking by ID.
- **Response**:
  ```json
  {
    "id": "bookingId",
    "event": "eventId",
    "quantity": 2,
    "totalPrice": 200
  }
  ```

### DELETE `/:id`
- **Description**: Cancel a booking by ID.
- **Response**:
  ```json
  {
    "message": "Booking canceled successfully"
  }
  ```