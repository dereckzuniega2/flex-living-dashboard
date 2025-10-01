import { useEffect, useState } from "react";

type Review = {
  id: number;
  property: string;
  reviewer: string;
  rating: number | null;
  review: string;
  date: string;
  approved: boolean;
};

export default function PropertyReviews({ propertyName }: { propertyName: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews/hostaway")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.reviews.filter(
          (r: Review) => r.property === propertyName && r.approved
        );
        setReviews(filtered);
      });
  }, [propertyName]);

  if (reviews.length === 0) {
    return (
      <p className="text-gray-400 italic text-center mt-6 animate-pulse">
        No approved reviews yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="bg-gray-900/80 p-5 rounded-xl shadow-md border border-gray-700 
                     hover:shadow-xl hover:border-yellow-400 transition-all duration-300 
                     transform hover:-translate-y-1 hover:scale-[1.02] group"
        >
          {/* Reviewer & Date */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors">
              {r.reviewer}
            </h3>
            <p className="text-gray-400 text-sm">
              {new Date(r.date).toLocaleDateString()}
            </p>
          </div>

          {/* Review Text */}
          <p className="text-gray-300 mb-3 leading-relaxed group-hover:text-gray-200 transition-colors">
            {r.review}
          </p>

          {/* Rating Badge */}
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full transition-all
              ${
                r.rating && r.rating >= 8
                  ? "bg-green-500/20 text-green-400 group-hover:bg-green-500/30"
                  : "bg-red-500/20 text-red-400 group-hover:bg-red-500/30"
              }`}
          >
            {r.rating ?? "N/A"} ⭐
          </span>
        </div>
      ))}
    </div>
  );
}
