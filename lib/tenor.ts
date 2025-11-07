/**
 * Tenor GIF API Integration
 * Get your API key from: https://tenor.com/developer/dashboard
 */

const TENOR_API_KEY = process.env.NEXT_PUBLIC_TENOR_API_KEY || "AIzaSyDnL5MpB0XJJGb5YXgUa0iSh7T-vb8LoXg"; // Demo key
const TENOR_API_URL = "https://tenor.googleapis.com/v2";

export interface TenorGif {
  id: string;
  title: string;
  media_formats: {
    gif: { url: string };
    tinygif: { url: string };
    nanogif: { url: string };
  };
  created: number;
  itemurl: string;
}

export async function searchGifs(query: string, limit: number = 20): Promise<TenorGif[]> {
  try {
    const response = await fetch(
      `${TENOR_API_URL}/search?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=${limit}&media_filter=gif,tinygif`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GIFs");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("[TENOR_SEARCH]", error);
    return [];
  }
}

export async function getTrendingGifs(limit: number = 20): Promise<TenorGif[]> {
  try {
    const response = await fetch(
      `${TENOR_API_URL}/featured?key=${TENOR_API_KEY}&limit=${limit}&media_filter=gif,tinygif`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch trending GIFs");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("[TENOR_TRENDING]", error);
    return [];
  }
}

export async function getGifCategories(): Promise<string[]> {
  try {
    const response = await fetch(
      `${TENOR_API_URL}/categories?key=${TENOR_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data.tags || [];
  } catch (error) {
    console.error("[TENOR_CATEGORIES]", error);
    return ["happy", "sad", "excited", "love", "funny", "dance"];
  }
}


