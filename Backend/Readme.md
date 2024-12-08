
# API Documentation

## Base URL

All the API endpoints can be accessed from the following base URL:

```
http://localhost:5000
```

---

## API Endpoints

### 1. **User Registration**

- **Endpoint**: `/api/users/register`
- **Method**: `POST`
- **Description**: Registers a new user and returns a JWT token for authentication.

#### Request Body:
```json
{
  "fullname": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Validation:
- `fullname.firstName`: Required
- `fullname.lastName`: Required
- `email`: Must be a valid email address
- `password`: Must be at least 6 characters long

#### Response:
- **Success (201)**:
```json
{
  "message": "User registered and logged in successfully.",
  "user": {
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "token": "jwt_token_here"
}
```

- **Error (400)**:
```json
{
  "errors": [
    {
      "msg": "First name is required.",
      "param": "fullname.firstName",
      "location": "body"
    }
  ]
}
```

---

### 2. **User Login**

- **Endpoint**: `/api/users/login`
- **Method**: `POST`
- **Description**: Logs in an existing user and returns a JWT token for authentication.

#### Request Body:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Validation:
- `email`: Must be a valid email address
- `password`: Must not be empty

#### Response:
- **Success (200)**:
```json
{
  "message": "Login successful.",
  "user": {
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "token": "jwt_token_here"
}
```

- **Error (400)**:
```json
{
  "errors": [
    {
      "msg": "A valid email is required.",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

### 3. **Get User Profile (Protected Route)**

- **Endpoint**: `/api/users/profile`
- **Method**: `GET`
- **Description**: Fetches the profile of the currently authenticated user.

#### Request Headers:
- **Authorization**: `Bearer <JWT_TOKEN>`

#### Response:
- **Success (200)**:
```json
{
  "user": {
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

- **Error (404)**:
```json
{
  "message": "User not found."
}
```

---

### 4. **User Logout**

- **Endpoint**: `/api/users/logout`
- **Method**: `POST`
- **Description**: Logs out the current user by blacklisting their JWT token and clearing the cookie.

#### Request Headers:
- **Authorization**: `Bearer <JWT_TOKEN>`

#### Response:
- **Success (200)**:
```json
{
  "message": "Logged out successfully."
}
```

- **Error (400)**:
```json
{
  "message": "No token to logout."
}
```

---
