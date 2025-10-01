import { useEffect, useState } from "react";

type Review = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
};

export default function GoogleReviews({ placeId }: { placeId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `/api/google-reviews?placeId=${placeId}`
        );
        const data = await res.json();
        if (data.result) {
          setRating(data.result.rating);
          setReviews(data.result.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching Google reviews:", error);
      }
    };
    fetchReviews();
  }, [placeId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Google Reviews</h2>

      {rating && (
        <p className="text-gray-700 mb-4">
          ⭐ {rating.toFixed(1)} average rating
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No Google reviews available.</p>
      ) : (
        <div className="space-y-4">
          {reviews.slice(0, 2).map((review, idx) => (
            <div key={idx} className="border-b pb-4">
              <p className="font-semibold text-gray-700">
                {review.author_name} – ⭐ {review.rating}
              </p>
              <p className="text-gray-600 text-sm mt-1">{review.text}</p>
              <p className="text-xs text-gray-400 mt-1">
                {review.relative_time_description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
