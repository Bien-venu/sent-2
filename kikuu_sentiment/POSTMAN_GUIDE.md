# Kikuu Sentiment API - Postman Collection Guide

## 📦 Files Included

1. **`Kikuu_Sentiment_API.postman_collection.json`** - Complete API collection with all endpoints
2. **`Kikuu_Sentiment_Environment.postman_environment.json`** - Environment variables for local development

## 🚀 Quick Setup

### Step 1: Import Collection
1. Open Postman
2. Click **Import** button
3. Select **`Kikuu_Sentiment_API.postman_collection.json`**
4. Click **Import**

### Step 2: Import Environment
1. Click **Import** button again
2. Select **`Kikuu_Sentiment_Environment.postman_environment.json`**
3. Click **Import**
4. Select **"Kikuu Sentiment - Local Development"** environment from the dropdown

### Step 3: Start Django Server
```bash
cd kikuu_sentiment
python manage.py runserver
```

## 📋 Collection Structure

### 🔐 **Authentication** (4 endpoints)
- **Register User** - Create new user account
- **Login User** - Get JWT tokens (auto-saves to environment)
- **Refresh Token** - Refresh access token
- **List Users** - View all users

### 📝 **Reviews & Sentiment** (9 endpoints)
- **List Reviews** - Get all reviews with filtering
- **Create Review** - Add new review (requires auth)
- **Get Review Detail** - View specific review
- **Update Review** - Modify review (owner only)
- **Delete Review** - Remove review (owner only)
- **Get My Reviews** - User's own reviews
- **Get Reviews by Role** - Filter by buyer/seller
- **Review Statistics** - Analytics and metrics

### 🏪 **Store Management** (5 endpoints)
- **List Categories** - View product categories
- **Create Category** - Add new category (requires auth)
- **List Products** - Browse all products
- **Create Product** - Add product (sellers only)
- **Update Product** - Modify product (owner only)

### 🛒 **Shopping Cart** (4 endpoints)
- **List Cart Items** - View cart contents
- **Add to Cart** - Add products to cart
- **Update Cart Quantity** - Change item quantities
- **Remove from Cart** - Delete cart items

### 🛍️ **Order Management** (6 endpoints)
- **List User Orders** - View user's orders
- **Create Order** - Place new order
- **Update Order Status** - Change order status
- **Get Order History** - Complete order history
- **Get Seller Orders** - Orders with seller's products
- **Order Statistics** - Order analytics

### 🏥 **System Health** (2 endpoints)
- **Basic Health Check** - System status
- **Detailed Health Check** - Detailed metrics

## 🔧 Environment Variables

### Pre-configured Variables
```json
{
  "base_url": "http://localhost:8000/api",
  "base_url_health": "http://localhost:8000",
  "user_email": "test@example.com",
  "username": "testuser",
  "password": "testpass123",
  "seller_email": "seller@example.com",
  "seller_username": "testseller",
  "seller_password": "sellerpass123"
}
```

### Auto-managed Variables
- `access_token` - Automatically set after login
- `refresh_token` - Automatically set after login
- `seller_access_token` - For seller-specific operations

## 🧪 Testing Workflow

### Complete User Journey Test

#### 1. **Setup Users**
```
1. Run "Register User" (buyer)
2. Run "Login User" (saves token automatically)
3. Change user_email to seller_email in environment
4. Run "Register User" again (seller)
5. Run "Login User" (saves seller token)
```

#### 2. **Test Store Operations**
```
1. Run "Create Category" (as authenticated user)
2. Run "List Categories" (public)
3. Switch to seller token
4. Run "Create Product" (sellers only)
5. Run "List Products" (public)
```

#### 3. **Test Shopping Flow**
```
1. Switch to buyer token
2. Run "Add to Cart"
3. Run "List Cart Items"
4. Run "Update Cart Quantity"
5. Run "Create Order"
6. Run "List User Orders"
```

#### 4. **Test Review System**
```
1. Run "Create Review" (as buyer)
2. Run "List Reviews"
3. Run "Get My Reviews"
4. Run "Review Statistics"
5. Run "Get Reviews by Role - Buyer"
```

#### 5. **Test System Health**
```
1. Run "Basic Health Check"
2. Run "Detailed Health Check"
```

## 🔑 Authentication Flow

### Automatic Token Management
The collection includes scripts that automatically:
1. Save access and refresh tokens after login
2. Use tokens for authenticated requests
3. Handle token refresh when needed

### Manual Token Setup
If needed, you can manually set tokens:
1. Go to Environment variables
2. Set `access_token` value
3. Use `{{access_token}}` in Authorization headers

## 📊 Query Parameters & Filtering

### Reviews Filtering
```
GET /kikuu/reviews/
?user_role=buyer          # Filter by buyer/seller
&sentiment=positive       # Filter by sentiment
&rating=5                # Filter by rating (1-5)
&search=great            # Search in comments
&page=1                  # Pagination
```

### Orders Filtering
```
GET /orders/orders/
?status=pending          # Filter by order status
&page=1                  # Pagination
```

## 🎯 Common Use Cases

### 1. **E-commerce Testing**
- Register buyer and seller
- Create products as seller
- Shop and order as buyer
- Track orders and reviews

### 2. **API Integration Testing**
- Test all CRUD operations
- Verify authentication flows
- Check error responses
- Validate data formats

### 3. **Performance Testing**
- Use pagination parameters
- Test with large datasets
- Monitor response times
- Check system health

## ⚠️ Important Notes

### Authentication Requirements
- **Public**: Categories, Products (read), Reviews (read), Health checks
- **Authenticated**: Cart operations, Orders, My Reviews
- **Role-specific**: Product creation (sellers), Seller orders
- **Owner-only**: Update/delete own reviews and products

### Error Handling
The collection includes examples for:
- 400 Bad Request (validation errors)
- 401 Unauthorized (missing/invalid token)
- 403 Forbidden (insufficient permissions)
- 404 Not Found (resource not found)

### Data Validation
- Ratings: Must be 1-5
- Sentiment: Must be positive/negative/neutral
- User roles: Must be buyer/seller
- Email format validation
- Required fields validation

## 🔄 Environment Switching

### Local Development
```json
{
  "base_url": "http://localhost:8000/api",
  "base_url_health": "http://localhost:8000"
}
```

### Production/Staging
```json
{
  "base_url": "https://api.yourdomain.com/api",
  "base_url_health": "https://api.yourdomain.com"
}
```

## 📞 Support

### Troubleshooting
1. **Server not responding**: Ensure Django server is running
2. **Authentication errors**: Check if tokens are set correctly
3. **Permission errors**: Verify user role and ownership
4. **Validation errors**: Check request body format

### Health Checks
Use the health check endpoints to verify:
- Database connectivity
- Service availability
- System metrics

---

**Happy Testing! 🎉**

The Postman collection provides a complete testing environment for the Kikuu Sentiment API with automatic token management and comprehensive examples.
