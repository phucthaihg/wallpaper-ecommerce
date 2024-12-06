# Category API Documentation

## Table of Contents
- [Base URL](#base-url)
- [Public Endpoints](#public-endpoints)
  - [Get All Categories](#1-get-all-categories)
  - [Get Category by ID](#2-get-category-by-id)
  - [Get Category by Slug](#3-get-category-by-slug)
  - [Get Category Products](#4-get-category-products)
- [Protected Endpoints](#protected-endpoints)
  - [Create Category](#5-create-category)
  - [Update Category](#6-update-category)
  - [Delete Category](#7-delete-category)
  - [Update Display Order](#8-update-display-order)
  - [Bulk Delete Categories](#9-bulk-delete-categories)
- [Response Status Codes](#response-status-codes)
- [Error Response Format](#error-response-format)

## Base URL
```
http://localhost:8000/api/categories
```

## Public Endpoints

### 1. Get All Categories
Get all categories with their hierarchical structure.

#### `GET /`

#### Query Parameters
| Parameter    | Type   | Required | Description                  | Default |
|-------------|--------|----------|------------------------------|---------|
| includeInactive | boolean | No   | Include inactive categories | false   |

#### Success Response (200 OK)
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Wallpapers",
    "slug": "wallpapers",
    "description": "Beautiful wallpapers collection",
    "image": "/uploads/categories/wallpapers.jpg",
    "isActive": true,
    "displayOrder": 1,
    "productCount": 150,
    "subcategories": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Floral Wallpapers",
        "slug": "floral-wallpapers",
        "description": "Floral pattern wallpapers",
        "isActive": true,
        "displayOrder": 1,
        "productCount": 50
      }
    ],
    "metadata": {
      "metaTitle": "Wallpapers Collection",
      "metaDescription": "Explore our wallpaper collection",
      "keywords": ["wallpaper", "home decor"]
    }
  }
]
```

---

### 2. Get Category by ID
Get detailed information about a specific category.

#### `GET /:id`

#### Parameters
| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Category ID    |

#### Success Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Wallpapers",
  "slug": "wallpapers",
  "description": "Beautiful wallpapers collection",
  "image": "/uploads/categories/wallpapers.jpg",
  "isActive": true,
  "displayOrder": 1,
  "parentId": null,
  "productCount": 150,
  "subcategories": [],
  "metadata": {
    "metaTitle": "Wallpapers Collection",
    "metaDescription": "Explore our wallpaper collection",
    "keywords": ["wallpaper", "home decor"]
  }
}
```

#### Error Response
- **Category Not Found (404 Not Found)**
  ```json
  {
    "message": "Category not found"
  }
  ```

---

### 3. Get Category by Slug
Get category details using slug.

#### `GET /slug/:slug`

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| slug      | string | Yes      | Category slug   |

#### Success Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Wallpapers",
  "slug": "wallpapers",
  "description": "Beautiful wallpapers collection",
  "image": "/uploads/categories/wallpapers.jpg",
  "isActive": true,
  "displayOrder": 1,
  "parentId": null,
  "productCount": 150,
  "subcategories": []
}
```

---

### 4. Get Category Products
Get products belonging to a specific category.

#### `GET /:id/products`

#### Parameters
| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Category ID    |

#### Query Parameters
| Parameter | Type   | Required | Description           | Default |
|-----------|--------|----------|-----------------------|---------|
| page      | number | No       | Page number          | 1       |
| limit     | number | No       | Items per page       | 10      |
| sort      | string | No       | Sort field           | 'createdAt' |
| order     | string | No       | Sort order (ASC/DESC)| 'DESC'  |

#### Success Response (200 OK)
```json
{
  "products": [
    {
      "id": "product-uuid",
      "name": "Floral Wallpaper",
      "slug": "floral-wallpaper",
      "price": 29.99,
      "images": ["/uploads/products/floral-1.jpg"],
      "category": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Wallpapers",
        "slug": "wallpapers"
      }
    }
  ],
  "total": 150,
  "currentPage": 1,
  "totalPages": 15
}
```

## Protected Endpoints
These endpoints require admin authentication:
```
Authorization: Bearer <jwt_token>
```

### 5. Create Category
Create a new category.

#### `POST /`

#### Request Body (`multipart/form-data`)
| Field       | Type    | Required | Description              | Validation        |
|-------------|---------|----------|--------------------------|-------------------|
| name        | string  | Yes      | Category name           | 2-50 characters   |
| description | string  | No       | Category description    | Max 500 chars     |
| parentId    | string  | No       | Parent category ID      | Valid UUID        |
| image       | file    | No       | Category image          | Max 2MB, img only |
| metadata    | object  | No       | SEO metadata            | Valid JSON        |
| isActive    | boolean | No       | Category status         | Boolean           |

#### Example Request:
```json
{
  "name": "Wallpapers",
  "description": "Beautiful wallpapers collection",
  "parentId": null,
  "metadata": {
    "metaTitle": "Wallpapers Collection",
    "metaDescription": "Explore our wallpaper collection",
    "keywords": ["wallpaper", "home decor"]
  },
  "isActive": true
}
```

#### Success Response (201 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Wallpapers",
  "slug": "wallpapers",
  "description": "Beautiful wallpapers collection",
  "image": "/uploads/categories/wallpapers.jpg",
  "isActive": true,
  "displayOrder": 1,
  "parentId": null,
  "metadata": {
    "metaTitle": "Wallpapers Collection",
    "metaDescription": "Explore our wallpaper collection",
    "keywords": ["wallpaper", "home decor"]
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
        "message": "Name must be between 2 and 50 characters"
      }
    ]
  }
  ```

- **Invalid Parent (400 Bad Request)**
  ```json
  {
    "message": "Parent category not found"
  }
  ```

---

### 6. Update Category
Update an existing category.

#### `PUT /:id`

#### Parameters
| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Category ID    |

#### Request Body (`multipart/form-data`)
[Same fields as Create Category]

#### Success Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Updated Wallpapers",
  "slug": "updated-wallpapers",
  "description": "Updated description",
  "image": "/uploads/categories/wallpapers-new.jpg",
  "isActive": true,
  "displayOrder": 1,
  "parentId": null,
  "metadata": {
    "metaTitle": "Updated Wallpapers Collection",
    "metaDescription": "Updated description",
    "keywords": ["wallpaper", "home decor"]
  }
}
```

---

### 7. Delete Category
Delete a category.

#### `DELETE /:id`

#### Parameters
| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Category ID    |

#### Success Response (200 OK)
```json
{
  "message": "Category deleted successfully"
}
```

#### Error Responses
- **Has Products (400 Bad Request)**
  ```json
  {
    "message": "Cannot delete category with existing products"
  }
  ```

- **Has Subcategories (400 Bad Request)**
  ```json
  {
    "message": "Cannot delete category with existing subcategories"
  }
  ```

---

### 8. Update Display Order
Update category display order.

#### `PUT /:id/order`

#### Parameters
| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Category ID    |

#### Request Body
```json
{
  "displayOrder": 2
}
```

#### Success Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Wallpapers",
  "displayOrder": 2
}
```

---

### 9. Bulk Delete Categories
Delete multiple categories.

#### `POST /bulk-delete`

#### Request Body
```json
{
  "ids": ["category-uuid-1", "category-uuid-2"]
}
```

#### Success Response (200 OK)
```json
{
  "message": "Categories deleted successfully"
}
```

#### Error Response
```json
{
  "message": "Cannot delete categories with existing products"
}
```

## Response Status Codes

| Status Code | Description                          |
|-------------|--------------------------------------|
| 200         | OK - Request successful              |
| 201         | Created - Category created           |
| 400         | Bad Request - Invalid data           |
| 401         | Unauthorized - Missing token         |
| 403         | Forbidden - Not admin                |
| 404         | Not Found - Category not found       |
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