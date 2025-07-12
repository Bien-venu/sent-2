/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { Star, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { analyzeSentiment } from "../../lib/sentiment";
import { createReview } from "@/features/reviews/reviewSlice";
import { fetchMyReviews } from "@/features/reviews/reviewSlice";
interface WriteReviewFormProps {}

const WriteReviewForm: React.FC<WriteReviewFormProps> = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !text) {
      toast({
        title: "Incomplete Review",
        description: "Please provide a rating and a comment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const sentiment = await analyzeSentiment(text);

      await dispatch(
        createReview({
          comment: text,
          sentiment,
          rating,
          source_url: window.location.href,
        })
      ).unwrap();

      toast({
        title: "Review Submitted!",
        description: `Thank you for your feedback. We analyzed your review as ${sentiment}.`,
      });

      dispatch(fetchMyReviews());

      // Reset form
      setRating(0);
      setText("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-semibold mb-2 block">Your Rating</label>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <Star
                  key={starValue}
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    starValue <= (hoverRating || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="reviewText" className="font-semibold mb-2 block">
            Your Review
          </label>
          <Textarea
            id="reviewText"
            placeholder="What did you like or dislike?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Analyzing..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
};

export default WriteReviewForm;
