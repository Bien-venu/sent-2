import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts, fetchProduct } from '../features/products/productSlice';
import { fetchCategories, createCategory } from '../features/categories/categorySlice';
import { addToCartAsync, updateCartQuantityAsync, removeFromCartAsync } from '../features/cart/cartSlice';
import { postReview } from '../features/reviews/reviewSlice';
import { apiService } from '../utils/api';
import { toast } from 'sonner';

/**
 * This component demonstrates how to use all the dynamic API endpoints
 * Remove this component in production - it's for testing purposes only
 */
const ApiTestComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading: productsLoading } = useAppSelector(state => state.products);
  const { items: categories, loading: categoriesLoading } = useAppSelector(state => state.categories);
  const { loading: cartLoading } = useAppSelector(state => state.cart);
  const { loading: reviewLoading } = useAppSelector(state => state.reviews);

  const [productId, setProductId] = useState<number>(1);
  const [reviewText, setReviewText] = useState('');
  const [categoryName, setCategoryName] = useState('');

  // Test fetching all products
  const handleFetchProducts = () => {
    dispatch(fetchProducts());
    toast.info('Fetching products...');
  };

  // Test fetching a specific product
  const handleFetchProduct = () => {
    dispatch(fetchProduct(productId));
    toast.info(`Fetching product ${productId}...`);
  };

  // Test fetching categories
  const handleFetchCategories = () => {
    dispatch(fetchCategories());
    toast.info('Fetching categories...');
  };

  // Test creating a category
  const handleCreateCategory = () => {
    if (!categoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    dispatch(createCategory({
      category_name: categoryName,
      description: `Description for ${categoryName}`,
      cat_image_url: 'https://via.placeholder.com/300x200'
    }));
    toast.info('Creating category...');
    setCategoryName('');
  };

  // Test adding to cart
  const handleAddToCart = () => {
    dispatch(addToCartAsync({
      product: productId,
      quantity: 1
    }));
    toast.info('Adding to cart...');
  };

  // Test updating cart quantity
  const handleUpdateCartQuantity = () => {
    dispatch(updateCartQuantityAsync({
      product: productId,
      quantity: 2,
      action: 'add'
    }));
    toast.info('Updating cart quantity...');
  };

  // Test removing from cart
  const handleRemoveFromCart = () => {
    dispatch(removeFromCartAsync({
      product: productId,
      quantity: 1,
      action: 'remove'
    }));
    toast.info('Removing from cart...');
  };

  // Test posting a review
  const handlePostReview = () => {
    if (!reviewText.trim()) {
      toast.error('Please enter a review');
      return;
    }

    dispatch(postReview({
      comment: reviewText,
      sentiment: 'positive',
      source_url: window.location.href
    }));
    toast.info('Posting review...');
    setReviewText('');
  };

  // Test checkout
  const handleTestCheckout = async () => {
    try {
      const response = await apiService.checkout({
        shipping: {
          full_name: 'John Doe',
          email: 'john@example.com',
          address: '123 Main St',
          city: 'Kigali',
          zip_code: '25000'
        },
        payment: {
          payment_method: 'credit_card',
          card_number: '4111222233334444',
          expiry_date: '12/25',
          cvc: '123'
        }
      });
      toast.success('Checkout test successful!');
      console.log('Checkout response:', response.data);
    } catch (error) {
      toast.error('Checkout test failed');
      console.error('Checkout error:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Test Component</h1>
      <p className="text-gray-600 mb-6">
        This component demonstrates all the dynamic API endpoints. Remove in production.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products Section */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Products API</h2>
          <div className="space-y-2">
            <button 
              onClick={handleFetchProducts}
              disabled={productsLoading}
              className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
            >
              {productsLoading ? 'Loading...' : 'Fetch All Products'}
            </button>
            
            <div className="flex gap-2">
              <input
                type="number"
                value={productId}
                onChange={(e) => setProductId(Number(e.target.value))}
                className="flex-1 border p-2 rounded"
                placeholder="Product ID"
              />
              <button 
                onClick={handleFetchProduct}
                disabled={productsLoading}
                className="bg-green-500 text-white p-2 rounded disabled:opacity-50"
              >
                Fetch Product
              </button>
            </div>
            
            <p className="text-sm text-gray-600">
              Products loaded: {products.length}
            </p>
          </div>
        </div>

        {/* Categories Section */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Categories API</h2>
          <div className="space-y-2">
            <button 
              onClick={handleFetchCategories}
              disabled={categoriesLoading}
              className="w-full bg-purple-500 text-white p-2 rounded disabled:opacity-50"
            >
              {categoriesLoading ? 'Loading...' : 'Fetch Categories'}
            </button>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Category name"
              />
              <button 
                onClick={handleCreateCategory}
                disabled={categoriesLoading}
                className="bg-indigo-500 text-white p-2 rounded disabled:opacity-50"
              >
                Create
              </button>
            </div>
            
            <p className="text-sm text-gray-600">
              Categories loaded: {categories.length}
            </p>
          </div>
        </div>

        {/* Cart Section */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Cart API</h2>
          <div className="space-y-2">
            <button 
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="w-full bg-orange-500 text-white p-2 rounded disabled:opacity-50"
            >
              Add Product {productId} to Cart
            </button>
            
            <button 
              onClick={handleUpdateCartQuantity}
              disabled={cartLoading}
              className="w-full bg-yellow-500 text-white p-2 rounded disabled:opacity-50"
            >
              Update Cart Quantity
            </button>
            
            <button 
              onClick={handleRemoveFromCart}
              disabled={cartLoading}
              className="w-full bg-red-500 text-white p-2 rounded disabled:opacity-50"
            >
              Remove from Cart
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Reviews API</h2>
          <div className="space-y-2">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter review text"
              rows={3}
            />
            
            <button 
              onClick={handlePostReview}
              disabled={reviewLoading}
              className="w-full bg-teal-500 text-white p-2 rounded disabled:opacity-50"
            >
              {reviewLoading ? 'Posting...' : 'Post Review'}
            </button>
          </div>
        </div>

        {/* Checkout Section */}
        <div className="border p-4 rounded-lg md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Checkout API</h2>
          <button 
            onClick={handleTestCheckout}
            className="w-full bg-gray-800 text-white p-2 rounded"
          >
            Test Checkout (with sample data)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiTestComponent;
