
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

const DealsSection = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date('2025-07-01') - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="py-16 bg-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-xl p-8 md:p-12 text-white text-center">
          <Tag className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-4xl font-bold mb-4">Flash Sale!</h2>
          <p className="text-lg mb-6">Don't miss out on our limited-time offers. Up to 50% off!</p>
          <div className="flex justify-center space-x-4 md:space-x-8 mb-8">
            {Object.keys(timeLeft).length > 0 ? (
              Object.entries(timeLeft).map(([interval, value]) => (
                <div key={interval} className="text-center">
                  <div className="text-4xl font-bold">{String(value).padStart(2, '0')}</div>
                  <div className="text-sm uppercase">{interval}</div>
                </div>
              ))
            ) : (
              <span className="text-2xl font-bold">Deal has expired!</span>
            )}
          </div>
          <Link
            to="/products?sale=true"
            className="bg-white text-red-600 font-bold py-3 px-8 rounded-full hover:bg-red-100 transition-colors"
          >
            Shop Deals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DealsSection;
