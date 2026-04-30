export function canUseGeolocation() {
  return "geolocation" in navigator && window.isSecureContext;
}

export function getGeolocationBlockedMessage() {
  if (!("geolocation" in navigator)) {
    return "Este dispositivo o navegador no soporta geolocalización.";
  }

  if (!window.isSecureContext) {
    return [
      "La ubicación GPS solo funciona en HTTPS o localhost.",
      "Si abres la app desde una IP local en la tablet usando HTTP, el navegador bloqueará la ubicación.",
    ].join(" ");
  }

  return "No se pudo obtener la ubicación.";
}
