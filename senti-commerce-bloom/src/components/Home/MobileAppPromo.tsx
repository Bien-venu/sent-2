
import React from 'react';
import { Link } from 'react-router-dom';

const MobileAppPromo = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                <span className="block">Shop on the go.</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-gray-600">
                Get the best shopping experience with our mobile app. Access exclusive deals, and shop with sentiment analysis right from your pocket.
              </p>
              <div className="mt-8 flex space-x-4">
                <Link to="#" className="inline-block bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700">
                  App Store
                </Link>
                <Link to="#" className="inline-block bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700">
                  Google Play
                </Link>
              </div>
            </div>
          </div>
          <div className="relative h-64 lg:h-auto">
             <img className="absolute h-full w-full object-cover" src="/placeholder.svg" alt="App screenshot" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppPromo;
