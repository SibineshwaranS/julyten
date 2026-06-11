// CDN Configuration & Optimization Manager
//
// To optimize loading speed and prevent mobile memory pressure/flickering,
// you can serve your large assets (images, video, audio) through a high-performance CDN.
//
// RECOMMENDED SOLUTION (ImageKit, Cloudinary, or jsDelivr):
// 1. Upload your repository or files to a CDN (e.g. ImageKit, Cloudinary, or jsDelivr GitHub CDN).
// 2. Set the CDN_BASE_URL below.
// 3. Example for ImageKit: "https://ik.imagekit.io/your_id/"
// 4. Example for jsDelivr: "https://cdn.jsdelivr.net/gh/your_username/your_repo/src/assets/"
//
// If CDN_BASE_URL is empty, the application safely falls back to local Vite imports.

export const CDN_BASE_URL = "";

/**
 * Resolves the URL of an asset, preferring the CDN if configured.
 * @param {string} localAsset - The local import reference (fallback).
 * @param {string} assetPath - The relative path inside the assets folder (e.g., 'gallery/g1.jpg').
 * @returns {string} The resolved URL.
 */
export function getAssetUrl(localAsset, assetPath) {
  if (CDN_BASE_URL) {
    const base = CDN_BASE_URL.endsWith("/") ? CDN_BASE_URL : `${CDN_BASE_URL}/`;
    const cleanPath = assetPath.startsWith("/") ? assetPath.slice(1) : assetPath;
    return `${base}${cleanPath}`;
  }
  return localAsset;
}
