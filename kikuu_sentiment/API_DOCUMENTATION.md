# Kikuu Sentiment API Documentation

## Overview
This API provides comprehensive CRUD operations for reviews with role-based access control. Only users with 'seller' or 'buyer' roles can interact with the review system.

## Authentication
All write operations require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles
- **buyer**: Default role for regular users
- **seller**: Role for users who sell products

## Review Model Fields
- `id`: Unique identifier (auto-generated)
- `username`: Username of the reviewer (auto-filled from user)
- `user_email`: Email of the reviewer (read-only)
- `user_role`: Role of the reviewer (buyer/seller, auto-filled)
- `comment`: Review text content
- `sentiment`: Sentiment classification (positive/negative/neutral)
- `rating`: Rating from 1 to 5 stars
- `source_url`: Optional URL source (can be blank)
- `is_verified`: Whether the review is verified (admin only)
- `created_at`: Creation timestamp (auto-generated)
- `updated_at`: Last update timestamp (auto-updated)

## API Endpoints

### 1. List All Reviews / Create New Review
**Endpoint:** `GET/POST /api/kikuu/reviews/`

#### GET - List Reviews
- **Access:** Anyone
- **Query Parameters:**
  - `user_role`: Filter by role (seller/buyer)
  - `sentiment`: Filter by sentiment (positive/negative/neutral)
  - `rating`: Filter by rating (1-5)
  - `search`: Search in comments and usernames

**Example Request:**
```
GET /api/kikuu/reviews/?user_role=seller&sentiment=positive&rating=5
```

**Example Response:**
```json
[
  {
    "id": 1,
    "username": "john_seller",
    "user_email": "john@example.com",
    "user_role": "seller",
    "comment": "Great experience with the platform!",
    "sentiment": "positive",
    "rating": 5,
    "source_url": "https://example.com",
    "is_verified": false,
    "created_at": "2025-01-08T10:30:00Z",
    "updated_at": "2025-01-08T10:30:00Z"
  }
]
```

#### POST - Create Review
- **Access:** Authenticated sellers and buyers only
- **Required Fields:** `comment`, `sentiment`, `rating`
- **Optional Fields:** `source_url`

**Example Request:**
```json
{
  "comment": "Excellent service and fast delivery!",
  "sentiment": "positive",
  "rating": 5,
  "source_url": "https://example.com/order/123"
}
```

### 2. Review Detail (Retrieve/Update/Delete)
**Endpoint:** `GET/PUT/PATCH/DELETE /api/kikuu/reviews/<id>/`

#### GET - Retrieve Single Review
- **Access:** Anyone

#### PUT/PATCH - Update Review
- **Access:** Review owner only
- **Fields:** `comment`, `sentiment`, `rating`, `source_url`

#### DELETE - Delete Review
- **Access:** Review owner only

### 3. User's Own Reviews
**Endpoint:** `GET /api/kikuu/my-reviews/`
- **Access:** Authenticated users only
- **Returns:** All reviews created by the authenticated user

### 4. Reviews by Role
**Endpoint:** `GET /api/kikuu/reviews/role/<role>/`
- **Access:** Anyone
- **Parameters:** `role` must be 'seller' or 'buyer'
- **Query Parameters:** Same as list reviews (sentiment, rating)

**Example:**
```
GET /api/kikuu/reviews/role/seller/?sentiment=positive
```

### 5. Review Statistics
**Endpoint:** `GET /api/kikuu/reviews/stats/`
- **Access:** Anyone
- **Returns:** Comprehensive statistics about all reviews

**Example Response:**
```json
{
  "total_reviews": 150,
  "average_rating": 4.2,
  "sentiment_distribution": [
    {"sentiment": "positive", "count": 80},
    {"sentiment": "neutral", "count": 45},
    {"sentiment": "negative", "count": 25}
  ],
  "role_distribution": [
    {"user_role": "buyer", "count": 120},
    {"user_role": "seller", "count": 30}
  ],
  "rating_distribution": [
    {"rating": 1, "count": 5},
    {"rating": 2, "count": 10},
    {"rating": 3, "count": 25},
    {"rating": 4, "count": 60},
    {"rating": 5, "count": 50}
  ]
}
```

## Account Management

### Register User
**Endpoint:** `POST /api/accounts/register/`
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "buyer"
}
```

### Login
**Endpoint:** `POST /api/accounts/login/`
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": {
    "rating": ["Rating must be between 1 and 5."],
    "sentiment": ["Sentiment must be one of: positive, negative, neutral"]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "Only sellers and buyers can create reviews."
}
```

### 404 Not Found
```json
{
  "detail": "Review not found."
}
```

## Validation Rules
- **Rating:** Must be integer between 1 and 5
- **Sentiment:** Must be one of: 'positive', 'negative', 'neutral'
- **User Role:** Must be 'seller' or 'buyer'
- **Comment:** Required, cannot be empty
- **Email:** Must be valid email format
- **Password:** Minimum 8 characters

## Permission Rules
1. **Read Operations:** Anyone can view reviews and statistics
2. **Create Operations:** Only authenticated sellers and buyers
3. **Update/Delete Operations:** Only the review owner
4. **Role Verification:** User role is automatically set from user account
5. **Username Auto-fill:** Username is automatically filled from authenticated user
