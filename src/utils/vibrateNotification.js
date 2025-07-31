export function vibrateNotification() {
  if ("vibrate" in navigator) {
    navigator.vibrate([150, 100, 150]);
  }
}
