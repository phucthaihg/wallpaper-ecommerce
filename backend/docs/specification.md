# Specification API Documentation

## Table of Contents
- [Base URL](#base-url)
- [Public Endpoints](#public-endpoints)
  - [Get Templates by Category](#1-get-templates-by-category)
  - [Get Product Specifications](#2-get-product-specifications)
- [Protected Endpoints](#protected-endpoints)
  - [Create Template](#3-create-template)
  - [Update Template](#4-update-template)
  - [Delete Template](#5-delete-template)
  - [Update Display Order](#6-update-display-order)
  - [Update Product Specifications](#7-update-product-specifications)
- [Response Status Codes](#response-status-codes)
- [Error Response Format](#error-response-format)

## Base URL
```
http://localhost:8000/api/specifications
```

## Public Endpoints

### 1. Get Templates by Category
Get all specification templates for a specific category.

#### `GET /categories/:categoryId/specifications`

#### Parameters
| Parameter  | Type   | Required | Description   |
|------------|--------|----------|---------------|
| categoryId | string | Yes      | Category ID   |

#### Success Response (200 OK)
```json
[
  {
    "id": "spec-template-uuid",
    "name": "Width",
    "key": "width",
    "type": "number",
    "unit": "cm",
    "options": [],
    "required": true,
    "displayOrder": 1,
    "description": "Width of wallpaper roll",
    "validation": {
      "min": 10,
      "max": 100,
      "message": "Width must be between 10cm and 100cm"
    }
  },
  {
    "id": "spec-template-uuid-2",
    "name": "Pattern",
    "key": "pattern",
    "type": "select",
    "options": ["Floral", "Geometric", "Striped"],
    "required": true,
    "displayOrder": 2,
    "description": "Pattern type"
  }
]
```

---

### 2. Get Product Specifications
Get all specifications for a specific product.

#### `GET /products/:productId/specifications`

#### Parameters
| Parameter  | Type   | Required | Description   |
|------------|--------|----------|---------------|
| productId  | string | Yes      | Product ID    |

#### Success Response (200 OK)
```json
[
  {
    "id": "spec-uuid",
    "value": "53",
    "template": {
      "name": "Width",
      "key": "width",
      "type": "number",
      "unit": "cm"
    }
  },
  {
    "id": "spec-uuid-2",
    "value": "Floral",
    "template": {
      "name": "Pattern",
      "key": "pattern",
      "type": "select"
    }
  }
]
```

## Protected Endpoints
These endpoints require admin authentication:
```
Authorization: Bearer <jwt_token>
```

### 3. Create Template
Create a new specification template.

#### `POST /templates`

#### Request Body
| Field        | Type    | Required | Description               | Validation        |
|--------------|---------|----------|---------------------------|-------------------|
| name         | string  | Yes      | Display name             | 2-50 characters   |
| key          | string  | Yes      | Unique identifier        | Alphanumeric     |
| type         | string  | Yes      | Input type              | Enum values      |
| unit         | string  | No       | Measurement unit         | -                |
| options      | array   | No       | Options for select type  | Required if type=select |
| required     | boolean | No       | Is field required        | -                |
| categoryId   | string  | Yes      | Category ID              | Valid UUID       |
| displayOrder | number  | No       | Display order            | >= 0             |
| description  | string  | No       | Help text                | Max 200 chars    |
| validation   | object  | No       | Validation rules         | Valid JSON       |

#### Example Request:
```json
{
  "name": "Width",
  "key": "width",
  "type": "number",
  "unit": "cm",
  "required": true,
  "categoryId": "category-uuid",
  "displayOrder": 1,
  "description": "Width of wallpaper roll",
  "validation": {
    "min": 10,
    "max": 100,
    "message": "Width must be between 10cm and 100cm"
  }
}
```

#### Success Response (201 Created)
```json
{
  "id": "spec-template-uuid",
  "name": "Width",
  "key": "width",
  "type": "number",
  "unit": "cm",
  "required": true,
  "categoryId": "category-uuid",
  "displayOrder": 1,
  "description": "Width of wallpaper roll",
  "validation": {
    "min": 10,
    "max": 100,
    "message": "Width must be between 10cm and 100cm"
  }
}
```

#### Error Responses
- **Validation Error (400 Bad Request)**
  ```json
  {
    "message": "Validation error",
    "errors": [
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  }
  ```

### 4. Update Template
Update an existing specification template.

#### `PUT /templates/:id`

#### Parameters
| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| id        | string | Yes      | Template ID        |

#### Request Body
[Same fields as Create Template]

#### Success Response (200 OK)
```json
{
  "id": "spec-template-uuid",
  "name": "Updated Width",
  "key": "width",
  "type": "number",
  "unit": "cm",
  "required": true,
  "categoryId": "category-uuid",
  "displayOrder": 1,
  "description": "Updated description",
  "validation": {
    "min": 10,
    "max": 100,
    "message": "Width must be between 10cm and 100cm"
  }
}
```

### 5. Delete Template
Delete a specification template.

#### `DELETE /templates/:id`

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Template ID     |

#### Success Response (200 OK)
```json
{
  "message": "Template deleted successfully"
}
```

#### Error Response
```json
{
  "message": "Template is in use by products"
}
```

### 6. Update Display Order
Update template display order.

#### `PUT /templates/:id/order`

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Template ID     |

#### Request Body
```json
{
  "displayOrder": 2
}
```

#### Success Response (200 OK)
```json
{
  "id": "spec-template-uuid",
  "displayOrder": 2
}
```

### 7. Update Product Specifications
Update specifications for a product.

#### `PUT /products/:productId/specifications`

#### Parameters
| Parameter  | Type   | Required | Description     |
|------------|--------|----------|-----------------|
| productId  | string | Yes      | Product ID      |

#### Request Body
```json
{
  "specifications": [
    {
      "templateId": "spec-template-uuid",
      "value": "53"
    },
    {
      "templateId": "spec-template-uuid-2",
      "value": "Floral"
    }
  ]
}
```

#### Success Response (200 OK)
```json
[
  {
    "id": "spec-uuid",
    "value": "53",
    "template": {
      "name": "Width",
      "key": "width",
      "type": "number",
      "unit": "cm"
    }
  },
  {
    "id": "spec-uuid-2",
    "value": "Floral",
    "template": {
      "name": "Pattern",
      "key": "pattern",
      "type": "select"
    }
  }
]
```

## Specification Types
Available specification types and their formats:

### Text
```json
{
  "type": "text",
  "validation": {
    "minLength": 1,
    "maxLength": 100,
    "pattern": "^[a-zA-Z0-9 ]+$"
  }
}
```

### Number
```json
{
  "type": "number",
  "unit": "cm",
  "validation": {
    "min": 0,
    "max": 1000,
    "step": 0.1
  }
}
```

### Select
```json
{
  "type": "select",
  "options": ["Option 1", "Option 2", "Option 3"],
  "validation": {
    "required": true
  }
}
```

### Textarea
```json
{
  "type": "textarea",
  "validation": {
    "maxLength": 500
  }
}
```

## Response Status Codes

| Status Code | Description                          |
|-------------|--------------------------------------|
| 200         | OK - Request successful              |
| 201         | Created - Template created           |
| 400         | Bad Request - Invalid data           |
| 401         | Unauthorized - Missing token         |
| 403         | Forbidden - Not admin                |
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