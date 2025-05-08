import { proxy, ref, subscribe } from "valtio";

const audio = new Audio();

export const radioStore = proxy({
  audio: ref(audio),
  streamUrl: "",
  isPlaying: false,
  isBuffering: false,
  volume: 80,
  isMuted: false,
  error: "",
});

const handlePlay = () => {
  radioStore.isPlaying = true;
  radioStore.isBuffering = false;
};

const handlePause = () => {
  radioStore.isPlaying = false;
  radioStore.isBuffering = false;
};

const handleWaiting = () => {
  radioStore.isBuffering = true;
};

const handleError = () => {
  radioStore.isPlaying = false;
  radioStore.isBuffering = false;
};

export function bindRadioStoreToAudioElement() {
  audio.addEventListener("play", handlePlay);
  audio.addEventListener("playing", handlePlay);
  audio.addEventListener("pause", handlePause);
  audio.addEventListener("waiting", handleWaiting);
  audio.addEventListener("error", handleError);

  const unsubscribe = subscribe(radioStore, () => {
    audio.volume = radioStore.volume / 100;

    if (radioStore.isMuted) {
      audio.volume = 0;
    } else {
      audio.volume = radioStore.volume / 100;
    }
  });

  return function destroy() {
    audio.removeEventListener("play", handlePlay);
    audio.removeEventListener("playing", handlePlay);
    audio.removeEventListener("pause", handlePause);
    audio.removeEventListener("waiting", handleWaiting);
    audio.removeEventListener("error", handleError);

    // Stop audio on unmount
    audio.pause();
    audio.src = "";

    unsubscribe();
  };
}

export const handlePlayPause = () => {
  const audio = radioStore.audio;

  if (!audio) return;

  if (radioStore.isPlaying) {
    radioStore.isPlaying = false;
    audio.pause();
  } else {
    playFromUrl({ url: radioStore.streamUrl });
  }
};

export const handleVolumeChange = (value: number[]) => {
  radioStore.volume = value[0];

  if (value[0] > 0 && radioStore.isMuted) {
    radioStore.isMuted = false;
  }
};

export const toggleMute = () => {
  radioStore.isMuted = !radioStore.isMuted;
};

export const playFromUrl = (opts: { url: string }) => {
  const audio = radioStore.audio;

  if (!audio) return;

  if (radioStore.isPlaying) {
    audio.pause();
  }

  radioStore.error = "";

  if (!opts.url.trim()) {
    radioStore.error = "Please enter a stream URL";
    return;
  }

  radioStore.streamUrl = opts.url;

  // Only set a new source if we need to
  if (audio.src !== opts.url) {
    audio.src = opts.url;
  }

  radioStore.isBuffering = true;
  audio.play().catch((err) => {
    radioStore.error = "Failed to play stream: " + err.message;
    radioStore.isBuffering = false;
  });
};
