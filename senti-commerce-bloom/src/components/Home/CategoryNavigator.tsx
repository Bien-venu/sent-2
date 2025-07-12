
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Electronics', color: 'bg-blue-100', link: '/products?category=Electronics' },
  { name: 'Clothing', color: 'bg-green-100', link: '/products?category=Clothing' },
  { name: 'Sports', color: 'bg-yellow-100', link: '/products?category=Sports' },
  { name: 'Home', color: 'bg-purple-100', link: '/products?category=Home' },
  { name: 'Fashion', color: 'bg-pink-100', link: '/products?category=Fashion' },
];

const CategoryNavigator = () => {
  return (
    <div id="categories" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find what you're looking for in our popular categories.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link key={category.name} to={category.link}>
              <div className={`p-8 rounded-lg ${category.color} text-center font-semibold text-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                {category.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigator;
