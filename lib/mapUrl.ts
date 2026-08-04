/**
 * Helper to ensure Google Maps URLs are valid for iframe embedding.
 * Handles full <iframe> HTML snippets, share URLs (maps.app.goo.gl), and standard embed URLs.
 */
export function getCleanGoogleMapEmbedUrl(inputUrl?: string): string {
  const DEFAULT_EMBED =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.38788389595!2d85.9225219!3d26.7319955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec410043ba06c5%3A0x6fcdf05f17d769a1!2sNational%20Urology%20Center!5e0!3m2!1sen!2snp!4v1718000000000!5m2!1sen!2snp";

  if (!inputUrl || typeof inputUrl !== "string") {
    return DEFAULT_EMBED;
  }

  let url = inputUrl.trim();

  // If user pasted a full <iframe src="..."> HTML string, extract the src attribute
  if (url.includes("<iframe") && url.includes("src=")) {
    const match = url.match(/src=["']([^"']+)["']/);
    if (match && match[1]) {
      url = match[1];
    }
  }

  // If it's already a Google Maps embed URL, use it directly
  if (
    url.includes("google.com/maps/embed") ||
    url.includes("maps.google.com/maps")
  ) {
    return url;
  }

  // If user pasted a search query or location URL (e.g. google.com/maps?q=... or maps.google.com/?q=...)
  if (url.includes("google.com/maps") || url.includes("maps.google.com")) {
    // Check if it has a q parameter or query
    try {
      const parsed = new URL(url);
      const q =
        parsed.searchParams.get("q") ||
        parsed.searchParams.get("query") ||
        "National Urology Center Janakpur";
      return `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(q)}`;
    } catch {
      return DEFAULT_EMBED;
    }
  }

  // If user pasted a short link like maps.app.goo.gl or goo.gl/maps (which cannot be embedded directly in iframe due to X-Frame-Options)
  if (url.includes("maps.app.goo.gl") || url.includes("goo.gl/maps")) {
    // Return fallback official embed URL that works reliably in iframe without X-Frame-Options blocking
    return DEFAULT_EMBED;
  }

  return url;
}
