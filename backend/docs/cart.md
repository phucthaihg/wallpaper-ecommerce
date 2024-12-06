```markdown
# Cart API Documentation

## Base URL
```
http://localhost:8000/api/cart
```

## Public Endpoints

### Get Current Cart
```http
GET /cart
```

Returns current cart based on sessionId (guest) or userId (logged in user).

#### Response (200 OK)
```json
{
  "id": "cart-uuid",
  "status": "active",
  "items": [
    {
      "id": "item-uuid", 
      "productId": "product-uuid",
      "quantity": 2,
      "price": 29.99,
      "specifications": {
        "width": "53cm",
        "length": "10.05m"
      },
      "product": {
        "name": "Floral Wallpaper",
        "featuredImage": "/images/floral.jpg"
      }
    }
  ]
}
```

### Add to Cart
```http
POST /cart
```

#### Request Body
| Field          | Type    | Required | Description                    |
|----------------|---------|----------|--------------------------------|
| productId      | string  | Yes      | Product ID                     |
| quantity       | number  | Yes      | Quantity to add                |
| specifications | object  | No       | Product specifications         |

```json
{
  "productId": "product-uuid",
  "quantity": 2,
  "specifications": {
    "width": "53cm",
    "length": "10.05m"
  }
}
```

#### Response (201 Created)
```json
{
  "id": "item-uuid",
  "productId": "product-uuid", 
  "quantity": 2,
  "price": 29.99,
  "specifications": {
    "width": "53cm",
    "length": "10.05m"
  }
}
```

### Update Cart Item
```http
PUT /cart/items/:id
```

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Cart item ID    |

#### Request Body
```json
{
  "quantity": 3
}
```

#### Response (200 OK)
```json
{
  "id": "item-uuid",
  "quantity": 3,
  "price": 29.99
}
```

### Remove Cart Item 
```http
DELETE /cart/items/:id
```

#### Parameters
| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Cart item ID    |

#### Response (200 OK)
```json
{
  "message": "Item removed from cart"
}
```

## Protected Endpoints
Requires authentication token:
```
Authorization: Bearer <token>
```

### Get User's Carts
```http
GET /carts
```

Returns all carts for authenticated user.

#### Response (200 OK)
```json
[
  {
    "id": "cart-uuid",
    "status": "active",
    "items": [
      {
        "id": "item-uuid",
        "productId": "product-uuid",
        "quantity": 2,
        "price": 29.99
      }
    ]  
  }
]
```

### Merge Carts
```http
POST /cart/merge
```

Merges guest cart into user's cart after login.

#### Response (200 OK)
```json
{
  "id": "cart-uuid",
  "status": "active", 
  "items": [
    {
      "id": "item-uuid",
      "productId": "product-uuid",
      "quantity": 2,
      "price": 29.99
    }
  ]
}
```

## Error Responses

### 404 Not Found
```json
{
  "message": "Cart item not found"
}
```

### 400 Bad Request
```json
{
  "message": "Invalid quantity"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message"
}
```

## Response Status Codes
| Code | Description         |
|------|---------------------|
| 200  | Success            |
| 201  | Created            |
| 400  | Bad Request        |
| 401  | Unauthorized       |
| 404  | Not Found          |
| 500  | Server Error       |
```