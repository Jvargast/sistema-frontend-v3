let geocoder;
const cache = new Map();

function waitForGoogleMaps(timeout = 6000, interval = 50) {
  return new Promise((resolve) => {
    if (window.google?.maps?.Geocoder) return resolve(true);
    const start = Date.now();
    const id = setInterval(() => {
      if (window.google?.maps?.Geocoder) {
        clearInterval(id);
        resolve(true);
      } else if (Date.now() - start > timeout) {
        clearInterval(id);
        resolve(false);
      }
    }, interval);
  });
}

function isChile(result) {
  return result?.address_components?.some(
    (c) => c.types.includes("country") && c.short_name === "CL"
  );
}

function pickBest(results = []) {
  const priority = [
    "street_address",
    "route",
    "premise",
    "establishment",
    "plus_code",
  ];
  return (
    results.find((r) => r.types?.some((t) => priority.includes(t))) ||
    results[0] ||
    null
  );
}

/**
 *
 * @param {{lat:number, lng:number}} coords
 * @returns {Promise<string>}
 */
export default async function reverseGeocode({ lat, lng }) {
  const key = `${Number(lat).toFixed(5)},${Number(lng).toFixed(5)}`;
  if (cache.has(key)) return cache.get(key);

  const ready = await waitForGoogleMaps();
  if (!ready) return "";

  if (!geocoder) geocoder = new window.google.maps.Geocoder();

  try {
    const { results } = await geocoder.geocode({
      location: { lat: Number(lat), lng: Number(lng) },
    });

    const onlyCL = results?.filter(isChile);
    const best = pickBest(onlyCL?.length ? onlyCL : results);
    const address = best?.formatted_address || "";

    cache.set(key, address);
    return address;
  } catch (e) {
    console.error("reverseGeocode error:", e);
    return "";
  }
}
