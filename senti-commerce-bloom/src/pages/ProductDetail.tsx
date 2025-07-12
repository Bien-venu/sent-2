import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fetchProduct, fetchProducts } from "../features/products/productSlice";
import { addToCartAsync } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import SentimentBadge from "../components/SentimentBadge";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductImageGallery from "../components/Product/ProductImageGallery";
import WriteReviewForm from "../components/Product/WriteReviewForm";
import RelatedProducts from "../components/Product/RelatedProducts";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { fetchMyReviews } from "@/features/reviews/reviewSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const { selectedProduct } = useAppSelector((state) => state.products);
  const { items } = useAppSelector((state) => state.reviews);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [sentimentFilter, setSentimentFilter] = useState<
    "all" | "positive" | "negative" | "neutral"
  >("all");
  const { toast } = useToast();
  // Use useMemo to calculate sentiment counts efficiently
  const sentimentCounts = useMemo(() => {
    const counts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    items.forEach((review) => {
      if (review.sentiment === "positive") {
        counts.positive++;
      } else if (review.sentiment === "neutral") {
        counts.neutral++;
      } else if (review.sentiment === "negative") {
        counts.negative++;
      }
    });
    return counts;
  }, [items]); // Recalculate if 'items' array changes

  useEffect(() => {
    // Dispatch the async thunk action
    dispatch(fetchMyReviews());
  }, [dispatch]); // Add dispatch to the dependency array

  useEffect(() => {
    if (id) {
      const productId = Number(id);
      // Check if we already have this product in the store
      const productInStore =
        selectedProduct?.id === productId ? selectedProduct : null;
      if (productInStore) {
        // Data is fresh from the store, no need to re-fetch
        return;
      }
      // Fetch the specific product from API
      dispatch(fetchProduct(productId));
    }
  }, [id, dispatch, selectedProduct]);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlistItems.some(
    (item) => item.id === selectedProduct.id
  );

  const handleAddToCart = async () => {
    try {
      await dispatch(
        addToCartAsync({
          product: selectedProduct.id,
          quantity: quantity,
        })
      ).unwrap();
      toast({
        title: "Added to cart",
        description: `${quantity} x ${selectedProduct.product_name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
      console.error("Add to cart error:", error);
    }
  };

  const handleToggleWishlist = () => {
    if (!selectedProduct) return;
    dispatch(toggleWishlist(selectedProduct));
    if (isInWishlist) {
      toast({
        title: "Removed from wishlist",
        description: `${selectedProduct.product_name} has been removed from your wishlist.`,
      });
    } else {
      toast({
        title: "Added to wishlist",
        description: `${selectedProduct.product_name} has been added to your wishlist.`,
      });
    }
  };

  console.log("Reviews items:", items); // This will now show the array of review objects

  const sentimentChartData = [
    {
      name: "Positive",
      value: sentimentCounts.positive,
      fill: "#22c55e",
    },
    {
      name: "Neutral",
      value: sentimentCounts.neutral,
      fill: "#f59e0b",
    },
    {
      name: "Negative",
      value: sentimentCounts.negative,
      fill: "#ef4444",
    },
  ];

  const filteredReviews = (items || []).filter(
    (review) =>
      sentimentFilter === "all" || review.sentiment === sentimentFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8 text-sm">
        <Link to="/" className="text-gray-500 hover:text-blue-600">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link to="/products" className="text-gray-500 hover:text-blue-600">
          Products
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-800">{selectedProduct.product_name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <ProductImageGallery
          images={[
            selectedProduct.image_url,
            "/placeholder.svg",
            "/placeholder.svg",
            "/placeholder.svg",
            "/placeholder.svg",
          ]}
          name={selectedProduct.product_name}
        />

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-500">
                Category ID: {selectedProduct.category}
              </span>
              {selectedProduct.sentiment && (
                <SentimentBadge
                  sentiment={
                    selectedProduct.sentiment.positive >
                    selectedProduct.sentiment.negative
                      ? "positive"
                      : selectedProduct.sentiment.negative >
                        selectedProduct.sentiment.positive
                      ? "negative"
                      : "neutral"
                  }
                />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedProduct.product_name}
            </h1>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(4) // Default rating since API doesn't provide rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                ({items?.length || 0} reviews)
              </span>
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-6">
              ${selectedProduct.price}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-lg"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleToggleWishlist}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`w-5 h-5 text-gray-600 transition-colors ${
                  isInWishlist ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for Description, Reviews, Sentiment */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({filteredReviews.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="text-gray-600 leading-relaxed">
              <p>{selectedProduct.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="sentiment" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sentimentChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, "dataMax + 5"]} />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip
                    cursor={{ fill: "rgba(230, 230, 230, 0.5)" }}
                    formatter={(value: number) => `${value}`}
                  />
                  <Bar dataKey="value" barSize={40}>
                    {sentimentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {/* Sentiment Filter Buttons */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium">Filter by:</span>
                <Button
                  variant={sentimentFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSentimentFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={
                    sentimentFilter === "positive" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSentimentFilter("positive")}
                >
                  😃 Positive
                </Button>
                <Button
                  variant={
                    sentimentFilter === "neutral" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSentimentFilter("neutral")}
                >
                  😐 Neutral
                </Button>
                <Button
                  variant={
                    sentimentFilter === "negative" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSentimentFilter("negative")}
                >
                  😠 Negative
                </Button>
              </div>

              {filteredReviews.length > 0 ? (
                <div className="space-y-6">
                  {filteredReviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md p-6 animate-fade-in"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold">
                              {review?.username}
                            </span>
                            <SentimentBadge
                              sentiment={review?.sentiment}
                              size="sm"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review?.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(
                                review?.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {review?.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  {(items || []).length > 0
                    ? `No ${sentimentFilter} reviews. Try another filter!`
                    : "No reviews yet. Be the first to write one!"}
                </p>
              )}
            </div>
            <WriteReviewForm />
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        currentProductId={selectedProduct.id}
        category={selectedProduct.category.toString()}
      />
    </div>
  );
};

export default ProductDetail;
