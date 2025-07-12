import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid, List, Filter } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fetchProducts } from "../features/products/productSlice";
import { setSortBy, setCategory } from "../features/filters/filterSlice";
import FilterSidebar from "../components/FilterSidebar";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const ProductList = () => {
  const dispatch = useAppDispatch();
  const { items: products } = useAppSelector((state) => state.products);
  const filters = useAppSelector((state) => state.filters);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      dispatch(setCategory(category));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    // Fetch products from API if not already loaded
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const { searchQuery, category, minRating, priceRange, sentiment } =
        filters;

      const searchMatch =
        searchQuery.toLowerCase() === "" ||
        product.product_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const categoryMatch =
        category === "all" || product.category === parseInt(category); // Category is now a number
      const ratingMatch = 4 >= minRating; // Default rating since API doesn't provide rating
      const priceMatch =
        parseFloat(product.price) >= priceRange[0] &&
        parseFloat(product.price) <= priceRange[1];

      let sentimentMatch = true;
      if (sentiment !== "all" && product.sentiment) {
        const { positive, negative, neutral } = product.sentiment;
        if (sentiment === "positive")
          sentimentMatch = positive > negative && positive > neutral;
        else if (sentiment === "negative")
          sentimentMatch = negative > positive && negative > neutral;
        else if (sentiment === "neutral")
          sentimentMatch = neutral >= positive && neutral >= negative;
      }

      return (
        searchMatch &&
        categoryMatch &&
        ratingMatch &&
        priceMatch &&
        sentimentMatch
      );
    });

    return filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-desc":
          return parseFloat(b.price) - parseFloat(a.price);
        case "rating-desc":
          return 4 - 4; // Default rating since API doesn't provide rating
        case "sentiment-desc":
          const sentimentScoreA =
            (a.sentiment?.positive || 0) - (a.sentiment?.negative || 0);
          const sentimentScoreB =
            (b.sentiment?.positive || 0) - (b.sentiment?.negative || 0);
          return sentimentScoreB - sentimentScoreA;
        default:
          return 0;
      }
    });
  }, [products, filters]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-72 self-start sticky top-24">
          <FilterSidebar />
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">
                {filteredAndSortedProducts.length} products found
              </p>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="lg:hidden">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filters</span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Filters</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 overflow-y-auto">
                      <FilterSidebar />
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button>Apply</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>

              <select
                value={filters.sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="sentiment-desc">Best Sentiment</option>
              </select>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-700">
                No Products Found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
