# Authentication API Documentation

## Table of Contents
- [Base URL](#base-url)
- [Public Endpoints](#public-endpoints)
  - [Register](#1-register)
  - [Login](#2-login)
  - [Forgot Password](#3-forgot-password)
  - [Reset Password](#4-reset-password)
  - [Verify Email](#5-verify-email)
- [Protected Endpoints](#protected-endpoints)
  - [Change Password](#6-change-password)
  - [Refresh Token](#7-refresh-token)
  - [Logout](#8-logout)
- [Response Status Codes](#response-status-codes)
- [Error Response Format](#error-response-format)

## Base URL
```
http://localhost:8000/api/auth
```

## Public Endpoints

### 1. Register
Create a new user account.

#### `POST /register`

#### Request Body
| Field      | Type   | Required | Description                    | Validation                  |
|------------|--------|----------|--------------------------------|----------------------------|
| email      | string | Yes      | User's email address          | Valid email format         |
| password   | string | Yes      | User's password               | Min 8 characters, 1 number |
| firstName  | string | Yes      | User's first name             | 2-50 characters           |
| lastName   | string | Yes      | User's last name              | 2-50 characters           |
| phone      | string | No       | User's phone number           | 10-11 digits              |

#### Example Request:
```json
{
  "email": "user@example.com",
  "password": "strongPassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0123456789"
}
```

#### Success Response (201 Created)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  }
}
```

#### Error Responses
- **Email Already Exists (400 Bad Request)**
  ```json
  {
    "message": "Email already registered"
  }
  ```

- **Validation Error (400 Bad Request)**
  ```json
  {
    "message": "Validation error",
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
  ```

---

### 2. Login
Authenticate a user and receive a JWT token.

#### `POST /login`

#### Request Body
| Field    | Type   | Required | Description      | Validation          |
|----------|--------|----------|------------------|---------------------|
| email    | string | Yes      | User's email    | Valid email format  |
| password | string | Yes      | User's password | Non-empty string    |

#### Example Request:
```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

#### Success Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  }
}
```

#### Error Responses
- **Invalid Credentials (401 Unauthorized)**
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

- **Account Inactive (401 Unauthorized)**
  ```json
  {
    "message": "Account is disabled"
  }
  ```

---

### 3. Forgot Password
Request a password reset email.

#### `POST /forgot-password`

#### Request Body
| Field | Type   | Required | Description           | Validation         |
|-------|--------|----------|-----------------------|-------------------|
| email | string | Yes      | User's email address | Valid email format |

#### Example Request:
```json
{
  "email": "user@example.com"
}
```

#### Success Response (200 OK)
```json
{
  "message": "Password reset email sent"
}
```

#### Error Response
- **User Not Found (404 Not Found)**
  ```json
  {
    "message": "User not found"
  }
  ```

---

### 4. Reset Password
Reset password using token from email.

#### `POST /reset-password`

#### Request Body
| Field    | Type   | Required | Description                    | Validation                  |
|----------|--------|----------|--------------------------------|----------------------------|
| token    | string | Yes      | Reset token from email        | Non-empty string           |
| password | string | Yes      | New password                  | Min 8 characters, 1 number |

#### Example Request:
```json
{
  "token": "reset-token-from-email",
  "password": "newPassword123"
}
```

#### Success Response (200 OK)
```json
{
  "message": "Password reset successful"
}
```

#### Error Responses
- **Invalid Token (400 Bad Request)**
  ```json
  {
    "message": "Invalid or expired reset token"
  }
  ```

- **Password Validation (400 Bad Request)**
  ```json
  {
    "message": "Validation error",
    "errors": [
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
  ```

---

### 5. Verify Email
Verify user's email address.

#### `POST /verify-email/:token`

#### Parameters
| Parameter | Type   | Required | Description           | Validation         |
|-----------|--------|----------|-----------------------|-------------------|
| token     | string | Yes      | Email verification token | Non-empty string |

#### Success Response (200 OK)
```json
{
  "message": "Email verified successfully"
}
```

#### Error Response
- **Invalid Token (400 Bad Request)**
  ```json
  {
    "message": "Invalid or expired verification token"
  }
  ```

## Protected Endpoints
All protected endpoints require JWT authentication:
```
Authorization: Bearer <jwt_token>
```

### 6. Change Password
Change password for authenticated user.

#### `POST /change-password`

#### Request Body
| Field           | Type   | Required | Description          | Validation                  |
|-----------------|--------|----------|----------------------|----------------------------|
| currentPassword | string | Yes      | Current password    | Non-empty string           |
| newPassword     | string | Yes      | New password        | Min 8 characters, 1 number |

#### Example Request:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

#### Success Response (200 OK)
```json
{
  "message": "Password changed successfully"
}
```

#### Error Responses
- **Invalid Current Password (401 Unauthorized)**
  ```json
  {
    "message": "Current password is incorrect"
  }
  ```

- **Password Validation (400 Bad Request)**
  ```json
  {
    "message": "Validation error",
    "errors": [
      {
        "field": "newPassword",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
  ```

---

### 7. Refresh Token
Get a new JWT token.

#### `GET /refresh-token`

#### Success Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Response
- **Invalid Token (401 Unauthorized)**
  ```json
  {
    "message": "Invalid or expired token"
  }
  ```

---

### 8. Logout
Logout the current user.

#### `POST /logout`

#### Success Response (200 OK)
```json
{
  "message": "Logged out successfully"
}
```

## Response Status Codes

| Status Code | Description                          |
|-------------|--------------------------------------|
| 200         | OK - Request successful              |
| 201         | Created - Resource created           |
| 400         | Bad Request - Invalid data           |
| 401         | Unauthorized - Invalid credentials   |
| 403         | Forbidden - Insufficient permissions |
| 404         | Not Found - Resource not found       |
| 500         | Internal Server Error                |

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error message here",
  "errors": [
    {
      "field": "Field name (if applicable)",
      "message": "Specific error message"
    }
  ]
}
```

## Rate Limiting
Authentication endpoints are rate-limited:
- Register: 5 requests per hour per IP
- Login: 10 attempts per hour per IP
- Forgot Password: 3 requests per hour per email
- Reset Password: 3 attempts per hour per IP