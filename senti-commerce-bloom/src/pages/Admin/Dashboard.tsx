
import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingCart, MessageSquare, Star } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setOverview } from '../../features/sentiment/sentimentSlice';

const AdminDashboard = () => {
  const { overview } = useAppSelector((state) => state.sentiment);
  const { items: products } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Mock data for sentiment overview
    dispatch(setOverview({
      totalReviews: 1248,
      averageSentiment: 4.2,
      positivePercent: 72,
      negativePercent: 18,
      neutralPercent: 10,
    }));
  }, [dispatch]);

  const sentimentData = [
    { name: 'Positive', value: overview.positivePercent, color: '#10B981' },
    { name: 'Neutral', value: overview.neutralPercent, color: '#F59E0B' },
    { name: 'Negative', value: overview.negativePercent, color: '#EF4444' },
  ];

  const trendsData = [
    { month: 'Jan', positive: 65, negative: 25, neutral: 10 },
    { month: 'Feb', positive: 70, negative: 20, neutral: 10 },
    { month: 'Mar', positive: 68, negative: 22, neutral: 10 },
    { month: 'Apr', positive: 72, negative: 18, neutral: 10 },
    { month: 'May', positive: 75, negative: 15, neutral: 10 },
    { month: 'Jun', positive: 72, negative: 18, neutral: 10 },
  ];

  const categoryData = [
    { category: 'Electronics', positive: 70, negative: 20, neutral: 10 },
    { category: 'Clothing', positive: 85, negative: 10, neutral: 5 },
    { category: 'Home', positive: 65, negative: 25, neutral: 10 },
    { category: 'Sports', positive: 78, negative: 12, neutral: 10 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor customer sentiment and business metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{overview.totalReviews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Positive Sentiment</p>
              <p className="text-2xl font-bold text-gray-900">{overview.positivePercent}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{overview.averageSentiment}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sentiment Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="neutral" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment by Category</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="positive" fill="#10B981" name="Positive" />
            <Bar dataKey="neutral" fill="#F59E0B" name="Neutral" />
            <Bar dataKey="negative" fill="#EF4444" name="Negative" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
