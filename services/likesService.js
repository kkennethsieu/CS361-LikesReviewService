const review_service_url = `http://localhost:4000`;

// In-memory cache (optional for even faster access)
const localCache = new Map();

// Get authorId using cache → Redis → fallback HTTP
export async function getAuthorId(reviewId) {
  // 1. Check in-memory cache
  if (localCache.has(reviewId)) return localCache.get(reviewId);

  // 2. Fallback HTTP request
  try {
    const res = await fetch(`${review_service_url}/reviews/review/${reviewId}`);
    if (!res.ok) throw new Error(`Review not found: ${res.status}`);
    const data = await res.json();
    const authorId = data.userId;

    // Update cache
    localCache.set(reviewId, authorId);

    return authorId;
  } catch (err) {
    console.error("Failed to fetch authorId:", err);
    return null; // or handle error as needed
  }
}
