import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Product } from "../../features/products/productSlice";
import ProductCard from "../ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SentimentHighlightsProps {
  products: Product[];
}

const SentimentHighlights: React.FC<SentimentHighlightsProps> = ({
  products,
}) => {
  // Filter products that have sentiment data and find products with the highest positive sentiment
  const productsWithSentiment = products.filter((p) => p.sentiment);
  const highlightedProducts = [...productsWithSentiment]
    .sort((a, b) => (b.sentiment?.positive || 0) - (a.sentiment?.positive || 0))
    .slice(0, 4);

  const chartData = highlightedProducts.map((p) => ({
    name:
      p.product_name.length > 15
        ? `${p.product_name.substring(0, 12)}...`
        : p.product_name,
    positive: p.sentiment?.positive || 0,
    negative: p.sentiment?.negative || 0,
    neutral: p.sentiment?.neutral || 0,
  }));

  // If no products have sentiment data, don't render the component
  if (highlightedProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sentiment Champions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out products with the most positive feedback from our
            customers.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlightedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Positive Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-15}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis />
                    <Tooltip cursor={{ fill: "rgba(230, 230, 230, 0.5)" }} />
                    <Legend />
                    <Bar dataKey="positive" fill="#22c55e" name="Positive" />
                    <Bar dataKey="neutral" fill="#f59e0b" name="Neutral" />
                    <Bar dataKey="negative" fill="#ef4444" name="Negative" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SentimentHighlights;
