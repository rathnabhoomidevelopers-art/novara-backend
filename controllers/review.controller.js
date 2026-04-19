const fetch = require("node-fetch");

const CACHE_TTL = 1000 * 60 * 60; // 1 hour
let cachedReviews = null;
let cacheTime = 0;

exports.getReviews = async (req, res) => {
  try {
    if (cachedReviews && Date.now() - cacheTime < CACHE_TTL) {
      return res.json(cachedReviews);
    }

    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey  = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId || !apiKey) {
      console.warn("⚠️  WARNING: GOOGLE_PLACE_ID or GOOGLE_PLACES_API_KEY is missing from .env");
      return res.status(500).json({ error: "Google Places API not configured" });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places API error:", data.status, data.error_message);
      return res.status(500).json({ error: "Failed to fetch reviews from Google" });
    }

    const reviews = (data.result?.reviews || []).map((r) => ({
      name:   r.author_name,
      text:   r.text,
      rating: r.rating,
      time:   r.relative_time_description,
    }));

    cachedReviews = reviews;
    cacheTime = Date.now();

    res.json(reviews);
  } catch (err) {
    console.error("GOOGLE REVIEWS ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};