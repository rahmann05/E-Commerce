/**
 * lib/image-utils.ts
 * Utility for handling image URLs, especially for Supabase Storage.
 */

const SUPABASE_PROJECT_ID = "ghdadhlyhzdkrjlurifj";
const SUPABASE_STORAGE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public`;
const BUCKET_NAME = "product";

/**
 * Transforms a local path or filename into a full Supabase Storage URL.
 * If the input is already a full URL (http/https), it returns it as-is.
 * 
 * @param path The local path or filename (e.g., "/images/tees1.png" or "tees1.png")
 * @returns The full Supabase Storage URL
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/images/placeholder.png"; // Fallback if no path provided

  // If it's already an absolute URL, return it
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If it starts with data:, it's a base64 image
  if (path.startsWith("data:")) {
    return path;
  }

  // Remove leading slash if present
  let cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // If the path contains 'images/', we might want to strip it if the bucket doesn't have it
  // But for now, we'll assume the structure was preserved or the user wants it mapped.
  // Common pattern: local /images/tees1.png -> bucket products/tees1.png
  if (cleanPath.startsWith("images/")) {
    cleanPath = cleanPath.replace("images/", "");
  }

  return `${SUPABASE_STORAGE_URL}/${BUCKET_NAME}/${cleanPath}`;
}
