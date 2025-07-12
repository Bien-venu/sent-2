import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fetchProducts } from "../features/products/productSlice";
import HeroBanner from "../components/Home/HeroBanner";
import CategoryNavigator from "../components/Home/CategoryNavigator";
import FeaturedProducts from "../components/Home/FeaturedProducts";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import NewArrivals from "../components/Home/NewArrivals";
import SentimentHighlights from "../components/Home/SentimentHighlights";
import DealsSection from "../components/Home/DealsSection";
import CustomerReviews from "../components/Home/CustomerReviews";
import SentimentHowItWorks from "../components/Home/SentimentHowItWorks";
import NewsletterSignup from "../components/Home/NewsletterSignup";
import MobileAppPromo from "../components/Home/MobileAppPromo";

const Home = () => {
  const {
    items: products,
    loading,
    error,
  } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch products from API if not already loaded
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="bg-gray-50">
      <HeroBanner />
      <CategoryNavigator />
      <FeaturedProducts products={featuredProducts} />
      {products.length > 0 && <SentimentHighlights products={products} />}
      {products.length > 0 && <NewArrivals products={products} />}
      <DealsSection />
      {products.length > 0 && <CustomerReviews products={products} />}
      <SentimentHowItWorks />
      <WhyChooseUs />
      <NewsletterSignup />
      <MobileAppPromo />
    </div>
  );
};

export default Home;
