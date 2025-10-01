import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Review = {
  id: number;
  property: string;
  reviewer: string;
  rating: number | null;
  categories: { category: string; rating: number }[];
  channel: string;
  review: string;
  date: string;
  status: string;
  approved: boolean;
};

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [propertyFilter, setPropertyFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [sortOption, setSortOption] = useState("date_desc");

  useEffect(() => {
    fetch("/api/reviews/hostaway")
      .then((res) => res.json())
      .then((data) => {
        const withApproved = data.reviews.map((r: Review) => ({ ...r }));
        setReviews(withApproved);
        setFilteredReviews(withApproved);
      });
  }, []);

  // Unique values for filters
  const properties = Array.from(new Set(reviews.map((r) => r.property)));
  const categories = Array.from(new Set(reviews.flatMap((r) => r.categories.map((c) => c.category))));
  const channels = Array.from(new Set(reviews.map((r) => r.channel)));

  // Filtering
  useEffect(() => {
    let filtered = [...reviews];
    if (propertyFilter !== "All") filtered = filtered.filter((r) => r.property === propertyFilter);
    if (ratingFilter !== null) filtered = filtered.filter((r) => r.rating && r.rating >= ratingFilter);
    if (categoryFilter !== "All") filtered = filtered.filter((r) => r.categories.some((c) => c.category === categoryFilter));
    if (channelFilter !== "All") filtered = filtered.filter((r) => r.channel === channelFilter);

    // Sorting
    filtered.sort((a, b) => {
      if (sortOption === "rating_desc") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sortOption === "rating_asc") return (a.rating ?? 0) - (b.rating ?? 0);
      if (sortOption === "date_asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // date_desc
    });

    setFilteredReviews(filtered);
  }, [propertyFilter, ratingFilter, categoryFilter, channelFilter, sortOption, reviews]);

  const toggleApprove = async (id: number, approved: boolean) => {
    await fetch(`/api/reviews/hostaway`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved: !approved }),
    });
    setReviews(reviews.map((r) => (r.id === id ? { ...r, approved: !approved } : r)));
  };

  const propertyStats = properties.map((prop) => {
    const propReviews = reviews.filter((r) => r.property === prop);
    const avg = propReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / (propReviews.length || 1);
    const approvedCount = propReviews.filter((r) => r.approved).length;
    return { property: prop, averageRating: avg.toFixed(1), approvedCount };
  });

  // Chart data
  const chartData = {
    labels: propertyStats.map((s) => s.property),
    datasets: [
      {
        label: "Average Rating",
        data: propertyStats.map((s) => Number(s.averageRating)),
        backgroundColor: "#facc15", // yellow
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black/80 p-6 text-white backdrop-blur-sm">
      <h1 className="text-4xl font-bold mb-6">Flex Living Reviews Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 sticky top-0 z-10">
        <select
          className="p-2 border border-gray-700 bg-gray-800 text-white rounded"
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
        >
          <option value="All">All Properties</option>
          {properties.map((p) => (<option key={p} value={p}>{p}</option>))}
        </select>

        <select
          className="p-2 border border-gray-700 bg-gray-800 text-white rounded"
          value={ratingFilter ?? ""}
          onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All Ratings</option>
          {[10, 9, 8, 7, 6, 5].map((r) => (<option key={r} value={r}>{r}+ stars</option>))}
        </select>

        <select
          className="p-2 border border-gray-700 bg-gray-800 text-white rounded"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>

        <select
          className="p-2 border border-gray-700 bg-gray-800 text-white rounded"
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
        >
          <option value="All">All Channels</option>
          {channels.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>

        <select
          className="p-2 border border-gray-700 bg-gray-800 text-white rounded"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="rating_desc">Rating High → Low</option>
          <option value="rating_asc">Rating Low → High</option>
        </select>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredReviews.map((r, index) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5}} // staggered fade
            className="bg-gray-900 p-4 rounded-lg shadow flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              <h2 className="font-bold text-lg text-white">{r.reviewer}</h2>
              <p className="text-gray-400 text-sm">{new Date(r.date).toLocaleDateString()}</p>
              <p className="mt-2 text-gray-300">{r.review}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {r.categories.map((cat) => (
                  <span
                    key={cat.category}
                    className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
                  >
                    {cat.category}: {cat.rating}
                  </span>
                ))}
                <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
                  {r.channel}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span
                className={`font-bold ${
                  r.rating && r.rating >= 8 ? "text-green-400" : "text-red-400"
                }`}
              >
                {r.rating ?? "N/A"} ⭐
              </span>
              <button
                className={`px-4 py-2 rounded font-semibold transition-all duration-200 
                  ${
                    r.approved
                      ? "bg-green-500 hover:bg-green-600 hover:scale-105"
                      : "bg-gray-600 hover:bg-yellow-500 hover:scale-105"
                  }`}
                onClick={() => toggleApprove(r.id, r.approved)}
              >
                {r.approved ? "✅ Approved" : "Approve"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="bg-gray-900 p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-2">Rating Trends</h2>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {propertyStats.map((stat) => (
          <Link href={`/property/${encodeURIComponent(stat.property)}`} key={stat.property}>
            <div
              className="bg-gray-900 p-4 rounded-lg shadow flex flex-col 
                        transform transition-all duration-300 cursor-pointer group 
                        hover:scale-105 hover:shadow-yellow-500/30 hover:bg-gray-800"
            >
              <span className="font-semibold text-white group-hover:text-yellow-400">
                {stat.property}
              </span>
              <span className="text-yellow-400 font-bold text-2xl mt-2 transition-transform">
                {stat.averageRating} ⭐
              </span>
              <span className="text-green-400 mt-1 text-sm group-hover:text-green-300">
                {stat.approvedCount} approved
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
