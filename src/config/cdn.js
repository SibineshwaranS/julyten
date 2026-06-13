// Cloudinary & jsDelivr CDN Optimization Manager
//
// 1. Cloudinary Credentials:
//    Cloud Name: dyssdtvk5
//
// 2. Video Optimization:
//    Your 60MB video is served using Cloudinary's dynamic video optimization (f_auto, q_auto)
//    which streams it as lightweight compressed segments (HLS/WebM/MP4) on mobile.

export const CLOUDINARY_CLOUD_NAME = "dyssdtvk5";

// Base URL for other assets fallback (e.g. jsDelivr GitHub CDN)
// Set to "" to serve assets directly from your own domain (bypasses CDN caching and updates instantly)
// Fallback CDN URL: "https://cdn.jsdelivr.net/gh/SibineshwaranS/julyten@main/src/assets/"
export const JSDELIVR_BASE_URL = "";

/**
 * Resolves the URL of an asset, preferring CDNs with f_auto,q_auto or local fallbacks.
 * @param {string} localAsset - The local import reference (fallback).
 * @param {string} assetPath - The relative path inside the assets folder (e.g., 'gallery/g1.jpg').
 * @returns {string} The resolved URL.
 */
export function getAssetUrl(localAsset, assetPath) {
  // 1. On local development, load the local assets directly so changes are instantly reflected on localhost
  if (import.meta.env.DEV) {
    return localAsset;
  }

  // 2. Optimize video with Cloudinary streaming
  if (assetPath === "video/video.mp4") {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto/v1781180678/video_f7lb3f.mp4`;
  }

  // 2. Optimize other images with Cloudinary if you upload them.
  // By default, we point images to jsDelivr fallback to keep them working.
  // To serve ALL images from Cloudinary:
  // Upload your 'gallery', 'memories', 'gift', and 'letter' folders to Cloudinary,
  // then uncomment the Cloudinary image mapping below.
  /*
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  if (imageExtensions.some(ext => assetPath.toLowerCase().endsWith(ext))) {
    // Cloudinary automatically optimizes format and quality on-the-fly
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${assetPath}`;
  }
  */

  // 3. Fallback to jsDelivr CDN
  if (JSDELIVR_BASE_URL) {
    const base = JSDELIVR_BASE_URL.endsWith("/") ? JSDELIVR_BASE_URL : `${JSDELIVR_BASE_URL}/`;
    const cleanPath = assetPath.startsWith("/") ? assetPath.slice(1) : assetPath;
    return `${base}${cleanPath}`;
  }

  return localAsset;
}
