import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  fetchCartItems,
  removeFromCartAsync,
  updateCartQuantityAsync,
  clearCart,
} from "../features/cart/cartSlice";
import { toast } from "sonner";

const Cart = () => {
  const { items, total, loading } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      await handleRemoveItem(id);
    } else {
      try {
        await dispatch(
          updateCartQuantityAsync({
            cart_item_id: id,
            quantity: newQuantity,
          })
        ).unwrap();
        // Refetch cart items after update
        dispatch(fetchCartItems());
      } catch (error) {
        toast.error("Failed to update quantity");
      }
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await dispatch(removeFromCartAsync(id)).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4"
            >
              <img
                src={item.product.image_url}
                alt={item.product.product_name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  {item.product.product_name}
                </h3>
                <p className="text-gray-600">${item.product.price}</p>
                <p className="text-sm text-gray-500">
                  Subtotal: ${item.sub_total}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    handleUpdateQuantity(item.id, item.quantity - 1)
                  }
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleUpdateQuantity(item.id, item.quantity + 1)
                  }
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="font-semibold text-lg">${item.sub_total}</p>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors mt-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>
                Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                items)
              </span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${(total * 1.08).toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 mb-4 block"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/products"
            className="w-full text-center text-blue-600 hover:text-blue-800 transition-colors block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
