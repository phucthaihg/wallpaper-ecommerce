# User API Documentation

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Profile Management](#profile-management)
    - [Get Profile](#1-get-profile)
    - [Update Profile](#2-update-profile)
    - [Update Avatar](#3-update-avatar)
  - [Address Management](#address-management)
    - [Get Addresses](#4-get-addresses)
    - [Add Address](#5-add-address)
    - [Update Address](#6-update-address)
    - [Delete Address](#7-delete-address)
    - [Set Default Address](#8-set-default-address)
  - [Preferences](#preferences)
    - [Get Preferences](#9-get-preferences)
    - [Update Preferences](#10-update-preferences)
  - [Admin Operations](#admin-operations)
    - [Get All Users](#11-get-all-users)
    - [Get User by ID](#12-get-user-by-id)
    - [Update User](#13-update-user)
    - [Delete User](#14-delete-user)
    - [Bulk Delete Users](#15-bulk-delete-users)
- [Response Status Codes](#response-status-codes)

## Base URL
```
http://localhost:8000/api/users
```

## Authentication
All endpoints require JWT authentication token in the header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Profile Management

#### 1. Get Profile
Get the current user's profile information.

#### `GET /profile`

#### Success Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0123456789",
  "avatar": "/uploads/avatars/user-avatar.jpg",
  "role": "customer",
  "isActive": true,
  "lastLogin": "2024-01-01T12:00:00Z"
}
```

---

#### 2. Update Profile
Update the current user's profile information.

#### `PUT /profile`

#### Request Body
| Field     | Type   | Required | Description        |
|-----------|---------|----------|--------------------|
| firstName | string  | No       | First name        |
| lastName  | string  | No       | Last name         |
| phone     | string  | No       | Phone number      |

#### Example Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0123456789"
}
```

#### Success Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0123456789",
  "email": "user@example.com"
}
```

---

#### 3. Update Avatar
Update user's profile picture.

#### `PUT /profile/avatar`

#### Request Body
`multipart/form-data`
| Field  | Type | Required | Description    |
|--------|------|----------|----------------|
| avatar | file | Yes      | Image file     |

#### Success Response (200 OK)
```json
{
  "avatar": "/uploads/avatars/user-avatar.jpg",
  "message": "Avatar updated successfully"
}
```

### Address Management

#### 4. Get Addresses
Get all addresses for the current user.

#### `GET /addresses`

#### Success Response (200 OK)
```json
[
  {
    "id": "address-uuid-1",
    "fullName": "John Doe",
    "phone": "0123456789",
    "address": "123 Main St",
    "city": "City",
    "province": "Province",
    "postalCode": "12345",
    "isDefault": true
  }
]
```

---

#### 5. Add Address
Add a new address for the current user.

#### `POST /addresses`

#### Request Body
| Field      | Type    | Required | Description           |
|------------|---------|----------|-----------------------|
| fullName   | string  | Yes      | Recipient name       |
| phone      | string  | Yes      | Contact number       |
| address    | string  | Yes      | Street address       |
| city       | string  | Yes      | City                 |
| province   | string  | Yes      | Province             |
| postalCode | string  | Yes      | Postal code          |
| isDefault  | boolean | No       | Set as default       |

#### Example Request:
```json
{
  "fullName": "John Doe",
  "phone": "0123456789",
  "address": "123 Main St",
  "city": "City",
  "province": "Province",
  "postalCode": "12345",
  "isDefault": true
}
```

#### Success Response (201 Created)
```json
{
  "id": "address-uuid",
  "fullName": "John Doe",
  "phone": "0123456789",
  "address": "123 Main St",
  "city": "City",
  "province": "Province",
  "postalCode": "12345",
  "isDefault": true
}
```

### Admin Operations

#### 11. Get All Users
Get a list of all users (admin only).

#### `GET /`

#### Query Parameters
| Parameter | Type    | Required | Description           |
|-----------|---------|----------|-----------------------|
| page      | number  | No       | Page number          |
| limit     | number  | No       | Items per page       |
| search    | string  | No       | Search term          |
| role      | string  | No       | Filter by role       |
| isActive  | boolean | No       | Filter by status     |

#### Success Response (200 OK)
```json
{
  "users": [
    {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "total": 100,
  "currentPage": 1,
  "totalPages": 10
}
```

---

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

[Previous content remains the same, then continue with...]

#### 6. Update Address
Update an existing address.

#### `PUT /addresses/:id`

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Address ID      |

#### Request Body
| Field      | Type    | Required | Description           |
|------------|---------|----------|-----------------------|
| fullName   | string  | No       | Recipient name       |
| phone      | string  | No       | Contact number       |
| address    | string  | No       | Street address       |
| city       | string  | No       | City                 |
| province   | string  | No       | Province             |
| postalCode | string  | No       | Postal code          |
| isDefault  | boolean | No       | Set as default       |

#### Success Response (200 OK)
```json
{
  "id": "address-uuid",
  "fullName": "John Doe",
  "phone": "0123456789",
  "address": "123 Main St",
  "city": "City",
  "province": "Province",
  "postalCode": "12345",
  "isDefault": true
}
```

#### Error Response (404 Not Found)
```json
{
  "message": "Address not found"
}
```

---

#### 7. Delete Address
Delete an existing address.

#### `DELETE /addresses/:id`

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Address ID      |

#### Success Response (200 OK)
```json
{
  "message": "Address deleted successfully"
}
```

---

#### 8. Set Default Address
Set an address as the default shipping address.

#### `PUT /addresses/:id/default`

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Address ID      |

#### Success Response (200 OK)
```json
{
  "id": "address-uuid",
  "fullName": "John Doe",
  "phone": "0123456789",
  "address": "123 Main St",
  "city": "City",
  "province": "Province",
  "postalCode": "12345",
  "isDefault": true
}
```

---

#### 9. Get Preferences
Get user's notification and display preferences.

#### `GET /preferences`

#### Success Response (200 OK)
```json
{
  "newsletter": true,
  "language": "en",
  "notifications": {
    "email": true,
    "sms": false,
    "orderUpdates": true
  }
}
```

---

#### 10. Update Preferences
Update user's preferences.

#### `PUT /preferences`

#### Request Body
```json
{
  "newsletter": true,
  "language": "en",
  "notifications": {
    "email": true,
    "sms": false,
    "orderUpdates": true
  }
}
```

#### Success Response (200 OK)
```json
{
  "newsletter": true,
  "language": "en",
  "notifications": {
    "email": true,
    "sms": false,
    "orderUpdates": true
  }
}
```

### Admin Operations

#### 11. Get All Users
Get a list of all users (admin only).

#### `GET /`

#### Query Parameters
| Parameter | Type    | Required | Description           | Default |
|-----------|---------|----------|-----------------------|---------|
| page      | number  | No       | Page number          | 1       |
| limit     | number  | No       | Items per page       | 10      |
| search    | string  | No       | Search term          | -       |
| role      | string  | No       | Filter by role       | -       |
| isActive  | boolean | No       | Filter by status     | -       |

#### Success Response (200 OK)
```json
{
  "users": [
    {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "total": 100,
  "currentPage": 1,
  "totalPages": 10
}
```

---

#### 12. Get User by ID
Get detailed information about a specific user (admin only).

#### `GET /:id`

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | User ID         |

#### Success Response (200 OK)
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0123456789",
  "role": "customer",
  "isActive": true,
  "addresses": [],
  "preferences": {},
  "createdAt": "2024-01-01T12:00:00Z",
  "lastLogin": "2024-01-01T12:00:00Z"
}
```

---

#### 13. Update User
Update user information (admin only).

#### `PUT /:id`

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | User ID         |

#### Request Body
| Field     | Type    | Required | Description           |
|-----------|---------|----------|-----------------------|
| firstName | string  | No       | First name           |
| lastName  | string  | No       | Last name            |
| phone     | string  | No       | Phone number         |
| role      | string  | No       | User role            |
| isActive  | boolean | No       | Account status       |

#### Success Response (200 OK)
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0123456789",
  "role": "customer",
  "isActive": true
}
```

---

#### 14. Delete User
Delete a user (admin only).

#### `DELETE /:id`

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | User ID         |

#### Success Response (200 OK)
```json
{
  "message": "User deleted successfully"
}
```

---

#### 15. Bulk Delete Users
Delete multiple users at once (admin only).

#### `POST /bulk-delete`

#### Request Body
```json
{
  "ids": ["user-uuid-1", "user-uuid-2"]
}
```

#### Success Response (200 OK)
```json
{
  "message": "Users deleted successfully"
}
```

---

#### 16. Update User Status
Update user's active status (admin only).

#### `PUT /:id/status`

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | User ID         |

#### Request Body
```json
{
  "isActive": true
}
```

#### Success Response (200 OK)
```json
{
  "id": "user-uuid",
  "isActive": true
}
```

---

#### 17. Bulk Update Status
Update status for multiple users (admin only).

#### `PUT /bulk-status`

#### Request Body
```json
{
  "ids": ["user-uuid-1", "user-uuid-2"],
  "isActive": true
}
```

#### Success Response (200 OK)
```json
{
  "message": "Users status updated successfully"
}
```

[Previous error responses and status codes section remains the same]