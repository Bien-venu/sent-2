import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Product } from "../features/products/productSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addToCartAsync } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        addToCartAsync({
          product: product.id,
          quantity: 1,
        })
      ).unwrap();
      toast.success(`${product.product_name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
      console.error("Add to cart error:", error);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    if (isInWishlist) {
      toast.info(`${product.product_name} removed from wishlist.`);
    } else {
      toast.success(`${product.product_name} added to wishlist!`);
    }
  };

  const getSentimentColor = () => {
    if (!product.sentiment) return "text-yellow-500";
    const { positive, negative, neutral } = product.sentiment;
    if (positive > negative && positive > neutral) return "text-green-500";
    if (negative > positive && negative > neutral) return "text-red-500";
    return "text-yellow-500";
  };

  const getSentimentEmoji = () => {
    if (!product.sentiment) return "😐";
    const { positive, negative, neutral } = product.sentiment;
    if (positive > negative && positive > neutral) return "😃";
    if (negative > positive && negative > neutral) return "😠";
    return "😐";
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img
            src={product.image_url}
            alt={product.product_name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 text-xs font-medium">
            <span className={getSentimentColor()}>{getSentimentEmoji()}</span>
          </div>
          {/* Wishlist button appears on hover for desktop */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 lg:opacity-100"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isInWishlist
                  ? "text-red-500 fill-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors mb-2 truncate">
            {product.product_name}
          </h3>

          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(4) // Default rating since API doesn't provide rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
