"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSnapshot } from "valtio";
import { handleVolumeChange, radioStore, toggleMute } from "@/stores/radio";

export const RadioVolumeControl = () => {
  const snap = useSnapshot(radioStore);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        aria-label={snap.isMuted ? "Unmute" : "Mute"}
      >
        {snap.isMuted || snap.volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      <Slider
        value={[snap.volume]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleVolumeChange}
        className="w-24"
      />
    </div>
  );
};
