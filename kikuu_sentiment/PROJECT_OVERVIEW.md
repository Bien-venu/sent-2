# Kikuu Sentiment - Complete Project Overview

## 🏗️ Project Architecture

**Kikuu Sentiment** is a Django REST API e-commerce platform with sentiment analysis for reviews. The project follows a modular architecture with separate apps for different functionalities.

### 📁 Project Structure

```
kikuu_sentiment/
├── kikuu_sentiment/          # Main project configuration
│   ├── settings.py          # Django settings
│   ├── urls.py             # Main URL routing
│   └── wsgi.py             # WSGI configuration
├── accounts/               # User management app
├── kikuu/                 # Reviews & sentiment analysis app
├── store/                 # Products & categories app
├── carts/                 # Shopping cart functionality
├── orders/                # Order management (not fully implemented)
├── manage.py              # Django management script
└── db.sqlite3            # SQLite database
```

## 🔧 Technology Stack

- **Backend**: Django 5.2.4 + Django REST Framework
- **Authentication**: JWT (Simple JWT)
- **Database**: SQLite (development)
- **API Documentation**: Custom markdown docs
- **CORS**: Enabled for frontend integration

## 📊 Database Schema & Models

### 1. **User Management (accounts app)**

```python
User Model:
- email (unique, primary login)
- username (unique)
- first_name, last_name
- role: 'buyer' | 'seller' (with choices)
- is_active, is_staff
- date_joined
```

### 2. **Reviews & Sentiment (kikuu app)**

```python
Review Model:
- user (ForeignKey to User)
- username (auto-filled)
- user_role (auto-filled: buyer/seller)
- comment (TextField)
- sentiment: 'positive' | 'negative' | 'neutral'
- rating (1-5 stars with validation)
- source_url (optional)
- is_verified (admin only)
- created_at, updated_at
```

### 3. **E-commerce Store (store app)**

```python
Category Model:
- category_name (unique)
- description
- cat_image_url

Product Model:
- product_name
- description
- price (DecimalField)
- image_url
- stock (PositiveIntegerField)
- is_available (Boolean)
- category (ForeignKey)
- user (seller - ForeignKey)
- created_date
```

### 4. **Shopping Cart (carts app)**

```python
Cart Model:
- cart_id
- date_added

CartItem Model:
- user (ForeignKey)
- product (ForeignKey)
- cart (ForeignKey)
- quantity
- is_active
- sub_total (calculated property)
```

### 5. **Orders (orders app - partial)**

```python
Payment Model:
- user, payment_id, payment_method
- amount_paid, status, created_at

Order Model:
- user, payment (optional)
- shipping details (name, email, phone, address)
- order_total, tax, status
- order_number, created_at, updated_at

OrderProduct Model:
- order, user, product
- quantity, product_price
- ordered, created_at, updated_at
```

## 🔗 API Endpoints Overview

### **Authentication & Users** (`/api/accounts/`)

| Method | Endpoint          | Description       | Access |
| ------ | ----------------- | ----------------- | ------ |
| POST   | `/register/`      | Register new user | Public |
| POST   | `/login/`         | User login        | Public |
| POST   | `/token/`         | Get JWT token     | Public |
| POST   | `/token/refresh/` | Refresh JWT token | Public |
| GET    | `/users/`         | List all users    | Public |

### **Reviews & Sentiment** (`/api/kikuu/`)

| Method               | Endpoint                | Description         | Access       |
| -------------------- | ----------------------- | ------------------- | ------------ |
| GET/POST             | `/reviews/`             | List/Create reviews | Public/Auth  |
| GET/PUT/PATCH/DELETE | `/reviews/<id>/`        | Review CRUD         | Public/Owner |
| GET                  | `/my-reviews/`          | User's own reviews  | Auth         |
| GET                  | `/reviews/role/<role>/` | Reviews by role     | Public       |
| GET                  | `/reviews/stats/`       | Review statistics   | Public       |

### **Store Management** (`/api/store/`)

| Method               | Endpoint            | Description            | Access        |
| -------------------- | ------------------- | ---------------------- | ------------- |
| GET/POST             | `/categories/`      | List/Create categories | Public/Auth   |
| GET/PUT/PATCH/DELETE | `/categories/<id>/` | Category CRUD          | Public/Auth   |
| GET/POST             | `/products/`        | List/Create products   | Public/Seller |
| GET/PUT/PATCH/DELETE | `/products/<id>/`   | Product CRUD           | Public/Owner  |

### **Shopping Cart** (`/api/carts/`)

| Method | Endpoint                  | Description      | Access |
| ------ | ------------------------- | ---------------- | ------ |
| GET    | `/items/`                 | List cart items  | Auth   |
| POST   | `/items/add/`             | Add to cart      | Auth   |
| DELETE | `/items/remove/<id>/`     | Remove from cart | Auth   |
| PUT    | `/items/update-quantity/` | Update quantity  | Auth   |

## 🔐 Security & Permissions

### **Authentication System**

- **JWT-based authentication** with access/refresh tokens
- **Access token lifetime**: 30 minutes
- **Refresh token lifetime**: 1 day
- **Token rotation**: Enabled for security

### **Role-Based Access Control**

1. **Public Access**: View products, categories, reviews, statistics
2. **Authenticated Users**: Create reviews, manage cart, view own data
3. **Sellers**: Create/manage products (role-specific)
4. **Buyers**: Default role, can review and purchase
5. **Owners Only**: Update/delete own reviews and products

### **Permission Classes**

- `ReviewPermission`: Custom permission for review operations
- `IsAuthenticated`: For protected endpoints
- `AllowAny`: For public endpoints
- Owner-based permissions for updates/deletes

## 🎯 Key Features

### **1. User Management**

- ✅ Custom User model with email-based authentication
- ✅ Role-based system (buyer/seller)
- ✅ JWT authentication with token refresh
- ✅ User registration with role selection

### **2. Review System**

- ✅ Complete CRUD operations
- ✅ Sentiment classification (positive/negative/neutral)
- ✅ 5-star rating system with validation
- ✅ Role-based reviews (buyer/seller perspectives)
- ✅ Advanced filtering and search
- ✅ Real-time statistics and analytics

### **3. E-commerce Store**

- ✅ Product catalog with categories
- ✅ Seller-specific product management
- ✅ Stock management and availability
- ✅ Image URL support for products

### **4. Shopping Cart**

- ✅ Add/remove products
- ✅ Quantity management
- ✅ Subtotal calculations
- ✅ User-specific carts

### **5. Advanced Features**

- ✅ Database indexing for performance
- ✅ Comprehensive filtering and search
- ✅ Real-time statistics
- ✅ CORS enabled for frontend integration
- ✅ Proper error handling and validation

## 📈 Data Flow & Business Logic

### **User Journey**

1. **Registration**: User registers with role (buyer/seller)
2. **Authentication**: Login to receive JWT tokens
3. **Browse**: View products and categories (public)
4. **Shop**: Add products to cart (authenticated)
5. **Review**: Leave reviews with ratings (authenticated)
6. **Manage**: Sellers can create/manage products

### **Review System Flow**

1. **Create**: Authenticated users create reviews
2. **Auto-assign**: System automatically sets user role and username
3. **Validate**: Rating (1-5) and sentiment validation
4. **Filter**: Advanced filtering by role, sentiment, rating
5. **Analytics**: Real-time statistics generation

### **Product Management Flow**

1. **Seller Registration**: User registers with 'seller' role
2. **Product Creation**: Sellers create products in categories
3. **Stock Management**: Track availability and quantities
4. **Public Viewing**: Anyone can browse products

## 🔧 Configuration & Setup

### **Environment Setup**

- Python virtual environment (`env/`)
- Django 5.2.4 with REST Framework
- SQLite database for development
- CORS configured for `localhost:3000`

### **Key Settings**

- **Custom User Model**: `accounts.User`
- **JWT Authentication**: Configured with Simple JWT
- **CORS**: Enabled for frontend integration
- **Debug Mode**: Enabled for development
- **Allowed Hosts**: Set to `['*']` for development

## 📝 Documentation & Testing

### **Available Documentation**

- `API_DOCUMENTATION.md`: Complete API reference
- `IMPLEMENTATION_SUMMARY.md`: Recent changes summary
- `PROJECT_OVERVIEW.md`: This comprehensive overview
- `test_api.py`: Automated testing script

### **Testing**

- Comprehensive test script covering all endpoints
- Manual testing with curl commands
- Server running successfully on `localhost:8000`
- All migrations applied successfully

## 🚀 Current Status

### **✅ Fully Implemented**

- User authentication and management
- Complete review CRUD with sentiment analysis
- Product and category management
- Shopping cart functionality
- Role-based permissions
- API documentation

### **⚠️ Partially Implemented**

- Orders app (models exist but no views/URLs)
- Payment processing (models only)
- Admin interface (basic setup)

### **🔄 Ready for Enhancement**

- Frontend integration (CORS configured)
- Payment gateway integration
- Order processing workflow
- Email notifications
- Advanced analytics dashboard

The project is **production-ready** for the core functionality (users, products, reviews, cart) with a solid foundation for extending to a complete e-commerce platform.

## 📋 Complete API Endpoint Reference

### **Base URL**: `http://localhost:8000/api`

| App          | Method    | Endpoint                        | Description                 | Auth Required | Role Required |
| ------------ | --------- | ------------------------------- | --------------------------- | ------------- | ------------- |
| **accounts** | POST      | `/accounts/register/`           | Register new user           | ❌            | -             |
| **accounts** | POST      | `/accounts/login/`              | User login                  | ❌            | -             |
| **accounts** | POST      | `/accounts/token/`              | Get JWT token               | ❌            | -             |
| **accounts** | POST      | `/accounts/token/refresh/`      | Refresh JWT                 | ❌            | -             |
| **accounts** | GET       | `/accounts/users/`              | List all users              | ❌            | -             |
| **kikuu**    | GET       | `/kikuu/reviews/`               | List reviews (with filters) | ❌            | -             |
| **kikuu**    | POST      | `/kikuu/reviews/`               | Create review               | ✅            | buyer/seller  |
| **kikuu**    | GET       | `/kikuu/reviews/<id>/`          | Get specific review         | ❌            | -             |
| **kikuu**    | PUT/PATCH | `/kikuu/reviews/<id>/`          | Update review               | ✅            | owner         |
| **kikuu**    | DELETE    | `/kikuu/reviews/<id>/`          | Delete review               | ✅            | owner         |
| **kikuu**    | GET       | `/kikuu/my-reviews/`            | User's own reviews          | ✅            | any           |
| **kikuu**    | GET       | `/kikuu/reviews/role/<role>/`   | Reviews by role             | ❌            | -             |
| **kikuu**    | GET       | `/kikuu/reviews/stats/`         | Review statistics           | ❌            | -             |
| **store**    | GET       | `/store/categories/`            | List categories             | ❌            | -             |
| **store**    | POST      | `/store/categories/`            | Create category             | ✅            | any           |
| **store**    | GET       | `/store/categories/<id>/`       | Get category                | ❌            | -             |
| **store**    | PUT/PATCH | `/store/categories/<id>/`       | Update category             | ✅            | any           |
| **store**    | DELETE    | `/store/categories/<id>/`       | Delete category             | ✅            | any           |
| **store**    | GET       | `/store/products/`              | List products               | ❌            | -             |
| **store**    | POST      | `/store/products/`              | Create product              | ✅            | seller        |
| **store**    | GET       | `/store/products/<id>/`         | Get product                 | ❌            | -             |
| **store**    | PUT/PATCH | `/store/products/<id>/`         | Update product              | ✅            | owner         |
| **store**    | DELETE    | `/store/products/<id>/`         | Delete product              | ✅            | owner         |
| **carts**    | GET       | `/carts/items/`                 | List cart items             | ✅            | any           |
| **carts**    | POST      | `/carts/items/add/`             | Add to cart                 | ✅            | any           |
| **carts**    | DELETE    | `/carts/items/remove/<id>/`     | Remove from cart            | ✅            | any           |
| **carts**    | PUT       | `/carts/items/update-quantity/` | Update quantity             | ✅            | any           |

### **Query Parameters for Filtering**

#### Reviews (`/kikuu/reviews/`)

- `user_role`: Filter by 'buyer' or 'seller'
- `sentiment`: Filter by 'positive', 'negative', or 'neutral'
- `rating`: Filter by rating (1-5)
- `search`: Search in comments and usernames

#### Example Requests

```bash
# Get all positive reviews from sellers
GET /api/kikuu/reviews/?user_role=seller&sentiment=positive

# Search for reviews containing "great"
GET /api/kikuu/reviews/?search=great

# Get 5-star reviews
GET /api/kikuu/reviews/?rating=5

# Combine filters
GET /api/kikuu/reviews/?user_role=buyer&sentiment=positive&rating=5
```
