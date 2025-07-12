# Kikuu Sentiment - E-commerce Platform API

## 🚀 Overview

Kikuu Sentiment is a comprehensive Django REST API e-commerce platform with sentiment analysis for reviews. The platform supports role-based access control with buyers and sellers, complete order management, and real-time analytics.

## 🏗️ Architecture

- **Backend**: Django 5.2.4 + Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Roles**: Buyer, Seller
- **Apps**: accounts, kikuu (reviews), store, carts, orders

## 🔧 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd kikuu_sentiment

# Create virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### 2. Base URL

```
http://localhost:8000/api
```

### 3. Authentication

Include JWT token in headers:

```
Authorization: Bearer <your_access_token>
```

## 📋 Complete API Reference

### 🔐 Authentication & User Management

#### Register User

```http
POST /api/accounts/register/
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "buyer"
}
```

**Response (201):**

```json
{
  "detail": "Account created successfully.",
  "user": {
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "role": "buyer"
  }
}
```

#### Login

```http
POST /api/accounts/login/
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**

```json
{
  "detail": "Login successful.",
  "token": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  },
  "user": {
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "role": "buyer"
  }
}
```

#### Refresh Token

```http
POST /api/accounts/token/refresh/
```

**Request Body:**

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### List Users

```http
GET /api/accounts/users/
```

**Response (200):**

```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "role": "buyer",
    "is_active": true,
    "date_joined": "2025-01-08T10:30:00Z"
  }
]
```

### 🏪 Store Management

#### List Categories

```http
GET /api/store/categories/
```

**Response (200):**

```json
[
  {
    "id": 1,
    "category_name": "Electronics",
    "description": "Electronic devices and gadgets",
    "cat_image_url": "https://example.com/electronics.jpg"
  }
]
```

#### Create Category

```http
POST /api/store/categories/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "category_name": "Fashion",
  "description": "Clothing and accessories",
  "cat_image_url": "https://example.com/fashion.jpg"
}
```

#### List Products

```http
GET /api/store/products/
```

**Response (200):**

```json
{
  "count": 25,
  "next": "http://localhost:8000/api/store/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "product_name": "iPhone 15",
      "description": "Latest iPhone model",
      "price": "999.99",
      "image_url": "https://example.com/iphone15.jpg",
      "stock": 50,
      "is_available": true,
      "category": 1,
      "user": 2,
      "created_date": "2025-01-08T10:30:00Z",
      "seller_phone_number": "+1234567890"
    }
  ]
}
```

#### Create Product (Sellers Only)

```http
POST /api/store/products/
Authorization: Bearer <seller_token>
```

**Request Body:**

```json
{
  "product_name": "MacBook Pro",
  "description": "High-performance laptop",
  "price": "1999.99",
  "image_url": "https://example.com/macbook.jpg",
  "stock": 10,
  "category": 1
}
```

#### Update Product

```http
PUT /api/store/products/1/
Authorization: Bearer <owner_token>
```

**Request Body:**

```json
{
  "product_name": "MacBook Pro M3",
  "description": "Latest MacBook with M3 chip",
  "price": "2199.99",
  "stock": 8
}
```

### 🛒 Shopping Cart

#### List Cart Items

```http
GET /api/carts/items/
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "product": {
      "id": 1,
      "product_name": "iPhone 15",
      "price": "999.99",
      "image_url": "https://example.com/iphone15.jpg"
    },
    "quantity": 2,
    "is_active": true,
    "sub_total": "1999.98"
  }
]
```

#### Add to Cart

```http
POST /api/carts/items/add/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "product_id": 1,
  "quantity": 2
}
```

#### Update Cart Quantity

```http
PUT /api/carts/items/update-quantity/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "cart_item_id": 1,
  "quantity": 3
}
```

#### Remove from Cart

```http
DELETE /api/carts/items/remove/1/
Authorization: Bearer <token>
```

### 📝 Reviews & Sentiment Analysis

#### List Reviews

```http
GET /api/kikuu/reviews/
```

**Query Parameters:**

- `user_role`: Filter by 'buyer' or 'seller'
- `sentiment`: Filter by 'positive', 'negative', 'neutral'
- `rating`: Filter by rating (1-5)
- `search`: Search in comments and usernames
- `page`: Page number for pagination

**Example:**

```http
GET /api/kikuu/reviews/?user_role=seller&sentiment=positive&rating=5&page=1
```

**Response (200):**

```json
{
  "count": 150,
  "next": "http://localhost:8000/api/kikuu/reviews/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "john_seller",
      "user_email": "john@example.com",
      "user_role": "seller",
      "comment": "Great platform for sellers! Easy to manage products.",
      "sentiment": "positive",
      "rating": 5,
      "source_url": "https://example.com/seller-experience",
      "is_verified": false,
      "created_at": "2025-01-08T10:30:00Z",
      "updated_at": "2025-01-08T10:30:00Z"
    }
  ]
}
```

#### Create Review

```http
POST /api/kikuu/reviews/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "comment": "Excellent service and fast delivery!",
  "sentiment": "positive",
  "rating": 5,
  "source_url": "https://example.com/order/123"
}
```

**Response (201):**

```json
{
  "message": "Review posted successfully.",
  "review": {
    "id": 15,
    "username": "johndoe",
    "user_email": "john@example.com",
    "user_role": "buyer",
    "comment": "Excellent service and fast delivery!",
    "sentiment": "positive",
    "rating": 5,
    "source_url": "https://example.com/order/123",
    "is_verified": false,
    "created_at": "2025-01-08T12:45:00Z",
    "updated_at": "2025-01-08T12:45:00Z"
  }
}
```

#### Update Review

```http
PATCH /api/kikuu/reviews/15/
Authorization: Bearer <owner_token>
```

**Request Body:**

```json
{
  "comment": "Updated: This platform keeps getting better!",
  "rating": 5
}
```

#### Delete Review

```http
DELETE /api/kikuu/reviews/15/
Authorization: Bearer <owner_token>
```

#### Get User's Reviews

```http
GET /api/kikuu/my-reviews/
Authorization: Bearer <token>
```

#### Get Reviews by Role

```http
GET /api/kikuu/reviews/role/buyer/
GET /api/kikuu/reviews/role/seller/
```

#### Review Statistics

```http
GET /api/kikuu/reviews/stats/
```

**Response (200):**

```json
{
  "total_reviews": 150,
  "average_rating": 4.2,
  "sentiment_distribution": [
    { "sentiment": "positive", "count": 80 },
    { "sentiment": "neutral", "count": 45 },
    { "sentiment": "negative", "count": 25 }
  ],
  "role_distribution": [
    { "user_role": "buyer", "count": 120 },
    { "user_role": "seller", "count": 30 }
  ],
  "rating_distribution": [
    { "rating": 1, "count": 5 },
    { "rating": 2, "count": 10 },
    { "rating": 3, "count": 25 },
    { "rating": 4, "count": 60 },
    { "rating": 5, "count": 50 }
  ]
}
```

### 🛍️ Order Management

#### List User Orders

```http
GET /api/orders/orders/
Authorization: Bearer <token>
```

**Query Parameters:**

- `status`: Filter by order status (pending, processed, shipped, completed, canceled)
- `page`: Page number

**Response (200):**

```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user_email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "district": "Kigali",
      "sector": "Nyarugenge",
      "cell": "Muhima",
      "order_total": "1199.89",
      "tax": "109.08",
      "status": "pending",
      "order_number": "ORD-000001",
      "is_ordered": true,
      "created_at": "2025-01-08T14:30:00Z",
      "updated_at": "2025-01-08T14:30:00Z",
      "order_products": [
        {
          "id": 1,
          "product": 1,
          "product_name": "iPhone 15",
          "product_image": "https://example.com/iphone15.jpg",
          "quantity": 1,
          "product_price": "999.99",
          "ordered": true,
          "created_at": "2025-01-08T14:30:00Z"
        }
      ],
      "payment_details": null
    }
  ]
}
```

#### Create Order

```http
POST /api/orders/orders/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "district": "Kigali",
  "sector": "Nyarugenge",
  "cell": "Muhima",
  "order_items": [
    {
      "product_id": 1,
      "quantity": 1
    },
    {
      "product_id": 2,
      "quantity": 2
    }
  ]
}
```

**Response (201):**

```json
{
  "id": 1,
  "user_email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "district": "Kigali",
  "sector": "Nyarugenge",
  "cell": "Muhima",
  "order_total": "1199.89",
  "tax": "109.08",
  "status": "pending",
  "order_number": "ORD-000001",
  "is_ordered": false,
  "created_at": "2025-01-08T14:30:00Z",
  "updated_at": "2025-01-08T14:30:00Z",
  "order_products": [],
  "payment_details": null
}
```

#### Update Order Status

```http
PATCH /api/orders/orders/1/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "shipped"
}
```

#### Get Order History

```http
GET /api/orders/my-orders/
Authorization: Bearer <token>
```

#### Get Seller Orders (Sellers Only)

```http
GET /api/orders/seller-orders/
Authorization: Bearer <seller_token>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "user_email": "buyer@example.com",
    "order_number": "ORD-000001",
    "status": "pending",
    "order_total": "1999.98",
    "created_at": "2025-01-08T14:30:00Z",
    "order_products": [
      {
        "id": 1,
        "product": 1,
        "product_name": "iPhone 15",
        "quantity": 2,
        "product_price": "999.99"
      }
    ]
  }
]
```

#### Order Statistics

```http
GET /api/orders/orders/stats/
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "total_orders": 5,
  "completed_orders": 3,
  "pending_orders": 2,
  "total_spent": 2999.97,
  "average_order_value": 999.99,
  "seller_stats": {
    "orders_with_my_products": 8,
    "total_revenue": 5999.94
  }
}
```

### 🏥 System Health & Monitoring

#### Basic Health Check

```http
GET /health/
```

**Response (200):**

```json
{
  "status": "healthy",
  "database": "healthy",
  "debug_mode": true,
  "version": "1.0.0",
  "services": {
    "accounts": "active",
    "kikuu": "active",
    "store": "active",
    "carts": "active"
  }
}
```

#### Detailed Health Check

```http
GET /health/detailed/
```

**Response (200):**

```json
{
  "status": "healthy",
  "database": {
    "status": "healthy",
    "connection": "active"
  },
  "metrics": {
    "total_reviews": 150,
    "total_users": 45,
    "total_products": 25
  },
  "system": {
    "debug_mode": true,
    "version": "1.0.0",
    "database_engine": "django.db.backends.sqlite3"
  },
  "services": {
    "accounts": "active",
    "kikuu": "active",
    "store": "active",
    "carts": "active",
    "orders": "active"
  }
}
```

## 🔒 Authentication & Permissions

### User Roles

- **buyer**: Default role, can browse, shop, review, and place orders
- **seller**: Can create/manage products, view seller-specific orders, and review

### Permission Levels

1. **Public**: View products, categories, reviews, statistics
2. **Authenticated**: Create reviews, manage cart, place orders
3. **Owner**: Update/delete own reviews, products, orders
4. **Role-specific**: Sellers can create products, view seller orders

### JWT Token Usage

```javascript
// Include in request headers
headers: {
  'Authorization': 'Bearer ' + accessToken,
  'Content-Type': 'application/json'
}
```

### Token Lifecycle

- **Access Token**: 30 minutes lifetime
- **Refresh Token**: 1 day lifetime
- **Auto-rotation**: Enabled for security

## ❌ Error Responses

### 400 Bad Request

```json
{
  "message": "Validation error",
  "errors": {
    "rating": ["Rating must be between 1 and 5."],
    "email": ["Enter a valid email address."]
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
  "detail": "Only sellers can create products."
}
```

### 404 Not Found

```json
{
  "detail": "Review not found."
}
```

### 500 Internal Server Error

```json
{
  "error": true,
  "message": "An error occurred",
  "details": "Internal server error details"
}
```

## 📊 Pagination

All list endpoints support pagination:

```json
{
  "count": 150,
  "next": "http://localhost:8000/api/kikuu/reviews/?page=3",
  "previous": "http://localhost:8000/api/kikuu/reviews/?page=1",
  "results": [...]
}
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

## 🧪 Testing Examples

### Using curl

#### Complete User Journey

```bash
# 1. Register a buyer
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@example.com",
    "username": "buyer123",
    "password": "securepass123",
    "first_name": "John",
    "last_name": "Buyer",
    "role": "buyer"
  }'

# 2. Register a seller
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@example.com",
    "username": "seller123",
    "password": "securepass123",
    "first_name": "Jane",
    "last_name": "Seller",
    "role": "seller"
  }'

# 3. Login as buyer
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@example.com",
    "password": "securepass123"
  }'

# 4. Create a review (replace TOKEN with actual token)
curl -X POST http://localhost:8000/api/kikuu/reviews/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Great platform for shopping!",
    "sentiment": "positive",
    "rating": 5
  }'

# 5. Get review statistics
curl -X GET http://localhost:8000/api/kikuu/reviews/stats/

# 6. Check system health
curl -X GET http://localhost:8000/health/
```

### Using Python requests

```python
import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"
headers = {"Content-Type": "application/json"}

# 1. Register and login
def register_and_login():
    # Register buyer
    buyer_data = {
        "email": "test_buyer@example.com",
        "username": "test_buyer",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "Buyer",
        "role": "buyer"
    }

    response = requests.post(f"{BASE_URL}/accounts/register/",
                           json=buyer_data, headers=headers)
    print(f"Registration: {response.status_code}")

    # Login
    login_data = {
        "email": "test_buyer@example.com",
        "password": "testpass123"
    }

    response = requests.post(f"{BASE_URL}/accounts/login/",
                           json=login_data, headers=headers)

    if response.status_code == 200:
        token = response.json()["token"]["access"]
        return token
    return None

# 2. Create review
def create_review(token):
    auth_headers = {**headers, "Authorization": f"Bearer {token}"}

    review_data = {
        "comment": "Amazing e-commerce platform!",
        "sentiment": "positive",
        "rating": 5,
        "source_url": "https://example.com/my-experience"
    }

    response = requests.post(f"{BASE_URL}/kikuu/reviews/",
                           json=review_data, headers=auth_headers)

    print(f"Review created: {response.status_code}")
    if response.status_code == 201:
        return response.json()["review"]["id"]
    return None

# 3. Get reviews with filtering
def get_filtered_reviews():
    # Get positive reviews from buyers
    params = {
        "user_role": "buyer",
        "sentiment": "positive",
        "rating": 5
    }

    response = requests.get(f"{BASE_URL}/kikuu/reviews/", params=params)
    print(f"Filtered reviews: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"Found {data['count']} reviews")
        return data["results"]
    return []

# 4. Get statistics
def get_statistics():
    response = requests.get(f"{BASE_URL}/kikuu/reviews/stats/")

    if response.status_code == 200:
        stats = response.json()
        print(f"Total reviews: {stats['total_reviews']}")
        print(f"Average rating: {stats['average_rating']}")
        return stats
    return None

# Run the test
if __name__ == "__main__":
    print("🚀 Testing Kikuu Sentiment API...")

    # Test user flow
    token = register_and_login()
    if token:
        review_id = create_review(token)
        reviews = get_filtered_reviews()
        stats = get_statistics()
        print("✅ All tests completed successfully!")
    else:
        print("❌ Authentication failed")
```

### Using JavaScript/Fetch

```javascript
// Configuration
const BASE_URL = "http://localhost:8000/api";

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  return { status: response.status, data };
}

// 1. Register user
async function registerUser() {
  const userData = {
    email: "js_user@example.com",
    username: "js_user",
    password: "testpass123",
    first_name: "JavaScript",
    last_name: "User",
    role: "buyer",
  };

  const result = await apiCall("/accounts/register/", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  console.log("Registration:", result.status);
  return result;
}

// 2. Login user
async function loginUser() {
  const loginData = {
    email: "js_user@example.com",
    password: "testpass123",
  };

  const result = await apiCall("/accounts/login/", {
    method: "POST",
    body: JSON.stringify(loginData),
  });

  if (result.status === 200) {
    return result.data.token.access;
  }
  return null;
}

// 3. Create review
async function createReview(token) {
  const reviewData = {
    comment: "Great API documentation!",
    sentiment: "positive",
    rating: 5,
  };

  const result = await apiCall("/kikuu/reviews/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  console.log("Review created:", result.status);
  return result;
}

// 4. Get reviews
async function getReviews() {
  const result = await apiCall("/kikuu/reviews/?sentiment=positive");
  console.log("Reviews fetched:", result.status);
  return result.data;
}

// Run tests
async function runTests() {
  console.log("🚀 Testing with JavaScript...");

  try {
    await registerUser();
    const token = await loginUser();

    if (token) {
      await createReview(token);
      const reviews = await getReviews();
      console.log(`Found ${reviews.count} reviews`);
      console.log("✅ JavaScript tests completed!");
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// runTests();
```

## 📋 API Endpoint Summary

| Category           | Endpoints        | Description                                |
| ------------------ | ---------------- | ------------------------------------------ |
| **Authentication** | 5 endpoints      | User registration, login, token management |
| **Reviews**        | 7 endpoints      | Complete CRUD, filtering, statistics       |
| **Store**          | 8 endpoints      | Products and categories management         |
| **Cart**           | 4 endpoints      | Shopping cart operations                   |
| **Orders**         | 5 endpoints      | Order management and tracking              |
| **Health**         | 2 endpoints      | System monitoring                          |
| **Total**          | **31 endpoints** | Complete e-commerce platform               |

## 🚀 Production Deployment

### Environment Variables

```bash
# Required for production
DEBUG=False
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/kikuu_db
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com

# Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Configure PostgreSQL database
- [ ] Set up proper static file serving
- [ ] Configure CORS for your frontend domain
- [ ] Set up SSL/HTTPS
- [ ] Configure email backend
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "kikuu_sentiment.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 📞 Support & Documentation

- **Health Check**: `GET /health/` for system status
- **API Version**: 1.0.0
- **Status**: Production Ready ✅
- **Last Updated**: January 2025

### Key Features

✅ Complete CRUD operations
✅ Role-based access control
✅ JWT authentication
✅ Pagination & filtering
✅ Real-time analytics
✅ System monitoring
✅ Production-ready logging

---

**Happy coding! 🎉**
