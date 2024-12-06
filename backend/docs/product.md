# Product API Documentation

## Table of Contents
- [Base URL](#base-url)
- [Public Endpoints](#public-endpoints)
  - [Get All Products](#1-get-all-products)
  - [Get Featured Products](#2-get-featured-products)
  - [Search Products](#3-search-products)
  - [Get Product by ID](#4-get-product-by-id)
  - [Get Product by Slug](#5-get-product-by-slug)
  - [Get Products by Category](#6-get-products-by-category)
- [Protected Endpoints](#protected-endpoints)
  - [Create Product](#7-create-product)
  - [Update Product](#8-update-product)
  - [Delete Product](#9-delete-product)
  - [Update Stock](#10-update-stock)
  - [Bulk Delete Products](#11-bulk-delete-products)
- [Response Status Codes](#response-status-codes)
- [Error Response Format](#error-response-format)

## Base URL
```
http://localhost:8000/api/products
```

## Public Endpoints

### 1. Get All Products
Get a paginated list of products with filters.

#### `GET /`

#### Query Parameters
| Parameter | Type    | Required | Description               | Default |
|-----------|---------|----------|---------------------------|---------|
| page      | number  | No       | Page number              | 1       |
| limit     | number  | No       | Items per page           | 12      |
| sort      | string  | No       | Sort field               | 'createdAt' |
| order     | string  | No       | Sort order (ASC/DESC)    | 'DESC'  |
| category  | string  | No       | Filter by category ID    | -       |
| search    | string  | No       | Search in name/description | -     |
| minPrice  | number  | No       | Minimum price            | -       |
| maxPrice  | number  | No       | Maximum price            | -       |
| inStock   | boolean | No       | Only in-stock items      | false   |

#### Success Response (200 OK)
```json
{
  "products": [
    {
      "id": "product-uuid",
      "name": "Floral Wallpaper",
      "slug": "floral-wallpaper",
      "description": "Beautiful floral pattern wallpaper",
      "price": 29.99,
      "compareAtPrice": 39.99,
      "sku": "WP-FLRL-001",
      "stockQuantity": 100,
      "images": ["/uploads/products/floral-1.jpg"],
      "featuredImage": "/uploads/products/floral-1.jpg",
      "category": {
        "id": "category-uuid",
        "name": "Wallpapers",
        "slug": "wallpapers"
      },
      "specifications": {
        "width": "53cm",
        "length": "10.05m",
        "pattern": "Floral"
      },
      "isActive": true,
      "tags": ["floral", "vintage"],
      "metadata": {
        "metaTitle": "Floral Wallpaper",
        "metaDescription": "Beautiful floral pattern wallpaper"
      }
    }
  ],
  "total": 100,
  "currentPage": 1,
  "totalPages": 9
}
```

---

### 2. Get Featured Products
Get a list of featured products.

#### `GET /featured`

#### Query Parameters
| Parameter | Type   | Required | Description    | Default |
|-----------|--------|----------|----------------|---------|
| limit     | number | No       | Number of items| 8       |

#### Success Response (200 OK)
```json
[
  {
    "id": "product-uuid",
    "name": "Floral Wallpaper",
    "slug": "floral-wallpaper",
    "price": 29.99,
    "compareAtPrice": 39.99,
    "featuredImage": "/uploads/products/floral-1.jpg",
    "category": {
      "id": "category-uuid",
      "name": "Wallpapers"
    },
    "avgRating": 4.5,
    "reviewCount": 12
  }
]
```

---

### 3. Search Products
Search products by name, description, or tags.

#### `GET /search`

#### Query Parameters
| Parameter | Type   | Required | Description        | Default |
|-----------|--------|----------|--------------------|---------|
| q         | string | Yes      | Search query       | -       |
| limit     | number | No       | Number of results  | 10      |

#### Success Response (200 OK)
```json
[
  {
    "id": "product-uuid",
    "name": "Floral Wallpaper",
    "slug": "floral-wallpaper",
    "price": 29.99,
    "featuredImage": "/uploads/products/floral-1.jpg",
    "category": {
      "id": "category-uuid",
      "name": "Wallpapers"
    }
  }
]
```

---

### 4. Get Product by ID
Get detailed information about a specific product.

#### `GET /:id`

#### Parameters
| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Product ID     |

#### Success Response (200 OK)
```json
{
  "id": "product-uuid",
  "name": "Floral Wallpaper",
  "slug": "floral-wallpaper",
  "description": "Beautiful floral pattern wallpaper",
  "price": 29.99,
  "compareAtPrice": 39.99,
  "sku": "WP-FLRL-001",
  "stockQuantity": 100,
  "images": [
    "/uploads/products/floral-1.jpg",
    "/uploads/products/floral-2.jpg"
  ],
  "featuredImage": "/uploads/products/floral-1.jpg",
  "category": {
    "id": "category-uuid",
    "name": "Wallpapers",
    "slug": "wallpapers"
  },
  "specifications": {
    "width": "53cm",
    "length": "10.05m",
    "pattern": "Floral"
  },
  "isActive": true,
  "tags": ["floral", "vintage"],
  "metadata": {
    "metaTitle": "Floral Wallpaper",
    "metaDescription": "Beautiful floral pattern wallpaper",
    "keywords": ["wallpaper", "floral", "home decor"]
  },
  "viewCount": 150,
  "avgRating": 4.5,
  "reviewCount": 12
}
```

#### Error Response
- **Product Not Found (404 Not Found)**
  ```json
  {
    "message": "Product not found"
  }
  ```

[Continue with rest of endpoints...]

## Protected Endpoints
These endpoints require admin authentication:
```
Authorization: Bearer <jwt_token>
```

### 7. Create Product
Create a new product.

#### `POST /`

#### Request Body (`multipart/form-data`)
| Field           | Type    | Required | Description             | Validation         |
|-----------------|---------|----------|-------------------------|-------------------|
| name            | string  | Yes      | Product name           | 2-100 characters  |
| description     | string  | No       | Product description    | Max 2000 chars    |
| price           | number  | Yes      | Current price          | > 0               |
| compareAtPrice  | number  | No       | Original price         | > 0               |
| sku             | string  | Yes      | Stock keeping unit     | Unique, alphanumeric |
| stockQuantity   | number  | Yes      | Available quantity     | >= 0              |
| categoryId      | string  | Yes      | Category ID            | Valid UUID        |
| images          | files   | No       | Product images         | Max 5, 2MB each   |
| specifications  | object  | No       | Product specifications | Valid JSON        |
| tags            | array   | No       | Product tags           | Array of strings  |
| metadata        | object  | No       | SEO metadata           | Valid JSON        |

#### Example Request:
```json
{
  "name": "Floral Wallpaper",
  "description": "Beautiful floral pattern wallpaper",
  "price": 29.99,
  "compareAtPrice": 39.99,
  "sku": "WP-FLRL-001",
  "stockQuantity": 100,
  "categoryId": "category-uuid",
  "specifications": {
    "width": "53cm",
    "length": "10.05m",
    "pattern": "Floral"
  },
  "tags": ["floral", "vintage"],
  "metadata": {
    "metaTitle": "Floral Wallpaper",
    "metaDescription": "Beautiful floral pattern wallpaper"
  }
}
```

[Continue with more endpoints and examples...]