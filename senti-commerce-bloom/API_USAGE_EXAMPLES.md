# API Usage Examples

This document shows how to use the dynamic API endpoints that have been integrated into the application.

## Available API Endpoints

### Categories
- `GET /api/store/categories/` - Get all categories
- `POST /api/store/categories/` - Create a new category

### Products
- `GET /api/store/products/` - Get all products
- `GET /api/store/products/{id}/` - Get a specific product

### Cart Operations
- `POST /api/carts/items/add/` - Add item to cart
- `POST /api/carts/items/update-quantity/` - Update item quantity
- `POST /api/carts/items/` - Remove item from cart

### Reviews
- `POST /api/kikuu/post-review/` - Post a new review

### Checkout
- `POST /api/orders/checkout/` - Process checkout

## Usage Examples

### 1. Fetching Products
```typescript
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts } from '../features/products/productSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading, error } = useAppSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

### 2. Adding to Cart
```typescript
import { addToCartAsync } from '../features/cart/cartSlice';

const handleAddToCart = async (productId: number) => {
  try {
    await dispatch(addToCartAsync({
      product: productId,
      quantity: 1,
    })).unwrap();
    toast.success('Added to cart!');
  } catch (error) {
    toast.error('Failed to add to cart');
  }
};
```

### 3. Updating Cart Quantity
```typescript
import { updateCartQuantityAsync } from '../features/cart/cartSlice';

const handleUpdateQuantity = async (productId: number, quantity: number) => {
  try {
    await dispatch(updateCartQuantityAsync({
      product: productId,
      quantity: quantity,
      action: 'add' // or 'remove'
    })).unwrap();
  } catch (error) {
    console.error('Failed to update quantity:', error);
  }
};
```

### 4. Posting a Review
```typescript
import { postReview } from '../features/reviews/reviewSlice';

const handlePostReview = async (comment: string, sentiment: string) => {
  try {
    await dispatch(postReview({
      comment: comment,
      sentiment: sentiment,
      source_url: window.location.href
    })).unwrap();
    toast.success('Review posted successfully!');
  } catch (error) {
    toast.error('Failed to post review');
  }
};
```

### 5. Processing Checkout
```typescript
import { apiService, CheckoutData } from '../utils/api';

const handleCheckout = async (formData: any) => {
  const checkoutData: CheckoutData = {
    shipping: {
      full_name: formData.name,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      zip_code: formData.zip,
    },
    payment: {
      payment_method: 'credit_card',
      card_number: formData.card,
      expiry_date: formData.expiry,
      cvc: formData.cvc,
    },
  };

  try {
    const response = await apiService.checkout(checkoutData);
    console.log('Checkout successful:', response.data);
  } catch (error) {
    console.error('Checkout failed:', error);
  }
};
```

### 6. Fetching Categories
```typescript
import { fetchCategories } from '../features/categories/categorySlice';

const CategoriesComponent = () => {
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h3>{category.category_name}</h3>
          <p>{category.description}</p>
          <img src={category.cat_image_url} alt={category.category_name} />
        </div>
      ))}
    </div>
  );
};
```

## API Data Structures

### Product
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  stock: number;
}
```

### Category
```typescript
interface Category {
  id: number;
  category_name: string;
  description: string;
  cat_image_url: string;
}
```

### Cart Item
```typescript
interface CartItem {
  id: number;
  product: number;
  quantity: number;
  is_active: boolean;
}
```

### Review
```typescript
interface Review {
  id: number;
  comment: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source_url: string;
  created_at: string;
}
```

## Error Handling

All API calls include proper error handling. Errors are stored in the Redux state and can be accessed:

```typescript
const { error } = useAppSelector(state => state.products);
if (error) {
  console.error('API Error:', error);
}
```

## Authentication

The API service automatically includes authentication tokens from localStorage:

```typescript
// Token is automatically added to requests if user is logged in
const response = await apiService.getProducts();
```
