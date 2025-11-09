const KEY = "posSelection:v1";

export function savePOSSelection(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    //
  }
}

export function loadPOSSelection() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
