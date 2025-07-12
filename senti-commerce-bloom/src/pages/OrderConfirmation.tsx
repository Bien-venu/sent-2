
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been placed successfully. You will receive an email confirmation shortly.
        </p>
        <Link
          to="/products"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
