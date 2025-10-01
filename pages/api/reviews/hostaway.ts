import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import mockData from "../../../public/mock-data.json";

const mockFilePath = path.join(process.cwd(), "public", "mock-data.json");

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  let data: any;

  try {
    // get accessToken
    const response = await fetch(`https://api.hostaway.com/v1/accessTokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.ACCOUNT_ID || "",
        client_secret: process.env.API_KEY || "",
        scope: "general",
      }).toString(),
    });
    const accessToken = await response.json();
    console.log("Access token received.", accessToken);

    // get reviews list
    const reviewsResponse = await fetch(`https://api.hostaway.com/v1/reviews`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
    });
    const reviews = await reviewsResponse.json();
    console.log("Reviews fetched:", reviews);

    // api contains no review - use realistic review data
    data = mockData;
  } catch (err) {
    console.error("Error fetching Hostaway API:", err);
  }

  // Normalize reviews
  const normalized: Review[] = data.result.map((review: any) => ({
    id: review.id,
    property: review.listingName,
    reviewer: review.guestName,
    rating: review.rating ?? review.reviewCategory?.[0]?.rating ?? null,
    categories: review.reviewCategory || [],
    channel: "Hostaway",
    review: review.publicReview,
    date: new Date(review.submittedAt).toISOString(),
    status: review.status,
    approved: review.approved ?? false,
  }));

  if (req.method === "GET") {
    res.status(200).json({ reviews: normalized });
  }
  
  // approved update
  if (req.method === "PATCH") {
    const { id, approved } = req.body;
    const reviewIndex = data.result.findIndex((r: any) => r.id === id);
    data.result[reviewIndex].approved = approved;

    // Save updated result to mock-data.json
    fs.writeFileSync(mockFilePath, JSON.stringify({ result: data.result }, null, 2));

    return res.status(200).json({ success: true });
  }
}
