
import React from 'react';
import { BrainCircuit, MessageSquareQuote, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';

const SentimentHowItWorks = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Sentiment AI Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We use cutting-edge AI to help you shop smarter, not harder.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <MessageSquareQuote className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">1. Analyze Reviews</h3>
            <p className="text-gray-600">Our AI reads through thousands of customer reviews for each product.</p>
          </div>
          <div className="p-6">
            <BrainCircuit className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">2. Understand Emotion</h3>
            <p className="text-gray-600">It identifies and categorizes the sentiment as positive, neutral, or negative.</p>
          </div>
          <div className="p-6">
            <ShoppingBag className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">3. Shop Confidently</h3>
            <p className="text-gray-600">You get clear insights to make informed decisions and find products you'll love.</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Button>Learn More About Our Technology</Button>
        </div>
      </div>
    </div>
  );
};

export default SentimentHowItWorks;
