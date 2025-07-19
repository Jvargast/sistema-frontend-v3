async function reverseGeocode({ lat, lng }) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&countrycodes=cl`
  );
  const data = await res.json();
  return data.display_name || "";
}

export default reverseGeocode;
