export const apiUrl = import.meta.env.VITE_API_URL;

export function getImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("blob:") || imageUrl.startsWith("http")) {
    return imageUrl;
  }
  if (imageUrl.startsWith("/images/")) {
    return `${apiUrl}${imageUrl}`;
  }
  return `${apiUrl}/images/${imageUrl}`;
}
