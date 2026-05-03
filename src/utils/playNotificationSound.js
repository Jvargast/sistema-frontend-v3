const NOTIFICATION_SOUND_SRC = "/notification.mp3";
const NOTIFICATION_VOLUME = 0.5;
const USER_INTERACTION_EVENTS = [
  "pointerdown",
  "mousedown",
  "touchstart",
  "keydown",
];

let audioElement = null;
let removeInteractionListeners = null;
let pendingPlay = false;
let preparingAudio = false;

const canUseAudio = () =>
  typeof window !== "undefined" && typeof Audio !== "undefined";

const getAudioElement = () => {
  if (!canUseAudio()) return null;

  if (!audioElement) {
    audioElement = new Audio(NOTIFICATION_SOUND_SRC);
    audioElement.preload = "auto";
    audioElement.volume = NOTIFICATION_VOLUME;
  }

  return audioElement;
};

const isAutoplayBlock = (error) => error?.name === "NotAllowedError";
const isIgnorableAbort = (error) => error?.name === "AbortError";

const clearInteractionListeners = () => {
  if (!removeInteractionListeners) return;
  removeInteractionListeners();
  removeInteractionListeners = null;
};

const tryPlayNotificationSound = async ({ muted = false } = {}) => {
  const audio = getAudioElement();
  if (!audio) return false;

  const previousMuted = audio.muted;
  const previousVolume = audio.volume;

  try {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = muted;
    audio.volume = muted ? 0 : NOTIFICATION_VOLUME;

    await audio.play();

    if (muted) {
      audio.pause();
      audio.currentTime = 0;
    }

    return true;
  } catch (error) {
    if (isAutoplayBlock(error)) {
      if (!muted) pendingPlay = true;
      setupNotificationSoundUnlock();
    } else if (!isIgnorableAbort(error)) {
      console.warn("No se pudo reproducir el sonido de notificacion:", error);
    }

    return false;
  } finally {
    audio.muted = previousMuted;
    audio.volume = previousVolume || NOTIFICATION_VOLUME;
  }
};

const handleUserInteraction = async () => {
  if (preparingAudio) return;
  preparingAudio = true;

  try {
    const shouldPlayPendingSound = pendingPlay;
    pendingPlay = false;

    const played = shouldPlayPendingSound
      ? await tryPlayNotificationSound()
      : await tryPlayNotificationSound({ muted: true });

    if (played) clearInteractionListeners();
  } finally {
    preparingAudio = false;
  }
};

export function setupNotificationSoundUnlock() {
  if (!canUseAudio() || removeInteractionListeners) {
    return clearInteractionListeners;
  }

  const options = { capture: true, passive: true };

  USER_INTERACTION_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, handleUserInteraction, options);
  });

  removeInteractionListeners = () => {
    USER_INTERACTION_EVENTS.forEach((eventName) => {
      window.removeEventListener(eventName, handleUserInteraction, options);
    });
  };

  return clearInteractionListeners;
}

export function playNotificationSound() {
  return tryPlayNotificationSound().then((played) => {
    if (played) {
      pendingPlay = false;
      clearInteractionListeners();
    }

    return played;
  });
}
