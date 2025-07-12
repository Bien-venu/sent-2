import React from "react";
import { useAppSelector } from "../../app/hooks";
import ProductCard from "../ProductCard";

interface RelatedProductsProps {
  currentProductId: number;
  category: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  category,
}) => {
  const { items: allProducts } = useAppSelector((state) => state.products);

  const relatedProducts = allProducts
    .filter((p) => p.category === category && p.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
