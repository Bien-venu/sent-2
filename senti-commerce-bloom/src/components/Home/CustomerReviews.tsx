import React from "react";
import { Product, Review } from "../../features/products/productSlice";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SentimentBadge from "../SentimentBadge";
import { Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

interface CustomerReviewsProps {
  products: Product[];
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ products }) => {
  const allReviews: (Review & { productName: string })[] = products
    .filter((p) => p.reviews && p.reviews.length > 0) // Filter products that have reviews
    .flatMap((p) =>
      p.reviews.map((r) => ({ ...r, productName: p.product_name }))
    )
    .slice(0, 10); // Take first 10 for carousel

  if (allReviews.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real reviews from real people who love our products.
          </p>
        </div>
        <Carousel
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {allReviews.map((review, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col">
                    <CardContent className="flex flex-col items-start p-6 flex-grow">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 flex-grow">
                        "{review.comment}"
                      </p>
                      <div className="w-full mt-auto">
                        <p className="font-semibold text-gray-900">
                          {review.username}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          on {review.productName}
                        </p>
                        <SentimentBadge
                          sentiment={review.sentiment}
                          size="sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </div>
  );
};

export default CustomerReviews;
