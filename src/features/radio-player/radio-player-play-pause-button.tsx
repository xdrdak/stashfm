"use client";

import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSnapshot } from "valtio";
import { handlePlayPause, radioStore } from "@/stores/radio";

export const RadioPlayPauseButton = () => {
  const snap = useSnapshot(radioStore);

  return (
    <Button
      onClick={handlePlayPause}
      variant="outline"
      disabled={(snap.isBuffering && !snap.isPlaying) || !snap.streamUrl}
    >
      {snap.isBuffering && !snap.isPlaying ? (
        <span className="flex items-center">
          <span className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></span>
          Loading
        </span>
      ) : snap.isPlaying ? (
        <>
          <Pause className="h-4 w-4" />
        </>
      ) : (
        <>
          <Play className="h-4 w-4" />
        </>
      )}
    </Button>
  );
};
