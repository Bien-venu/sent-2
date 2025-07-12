
import React, { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, name }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img src="/placeholder.svg" alt="Placeholder" className="w-full h-full object-cover" />
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
              mainImage === image ? 'border-blue-600' : 'border-transparent'
            }`}
            onClick={() => setMainImage(image)}
          >
            <img src={image} alt={`${name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
