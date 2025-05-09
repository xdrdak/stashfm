"use client";

import { Badge } from "@/components/ui/badge";
import { useSnapshot } from "valtio";
import { radioStore } from "@/stores/radio";

export const RadioPlayerStatusBadge = () => {
  const snap = useSnapshot(radioStore);

  let message = "No station selected";

  if (snap.isBuffering) {
    message = `Buffering ${snap.streamUrl}`;
  } else {
    if (snap.isPlaying) {
      message = `Listening to ${snap.streamUrl}`;
    }
    if (!snap.isPlaying && snap.streamUrl) {
      message = `Paused on ${snap.streamUrl}`;
    }
  }

  return (
    <div>
      {snap.error && snap.streamUrl !== "" ? (
        <Badge className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
          {snap.error}
        </Badge>
      ) : (
        <Badge variant={snap.isPlaying ? "default" : "outline"}>
          {message}
        </Badge>
      )}
    </div>
  );
};
