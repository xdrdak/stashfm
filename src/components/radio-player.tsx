"use client";

import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSnapshot } from "valtio";
import {
  handlePlayPause,
  handleVolumeChange,
  radioStore,
  toggleMute,
} from "@/stores/radio";

export default function RadioPlayer() {
  const snap = useSnapshot(radioStore);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Radio Player</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="stream-url" className="text-sm font-medium">
            Stream URL
          </label>
          <Input
            id="stream-url"
            type="url"
            placeholder="https://example.com/stream"
            value={snap.streamUrl}
            onChange={(e) => {
              radioStore.streamUrl = e.target.value;
            }}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <RadioPlayPauseButton />

          <RadioVolumeControl />
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <RadioPlayerStatus />
      </CardFooter>
    </Card>
  );
}

export const RadioPlayPauseButton = () => {
  const snap = useSnapshot(radioStore);

  return (
    <Button
      onClick={handlePlayPause}
      variant="outline"
      disabled={(snap.isBuffering && !snap.isPlaying) || !snap.streamUrl}
      className="w-24"
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
      <span className="text-xs w-8">{snap.volume}%</span>
    </div>
  );
};

export const RadioPlayerStatus = () => {
  const snap = useSnapshot(radioStore);

  return (
    <div>
      {snap.error && snap.streamUrl !== "" && (
        <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
          {snap.error}
        </div>
      )}
      <Badge variant={snap.isPlaying ? "default" : "outline"}>
        {snap.isBuffering
          ? "Buffering..."
          : snap.isPlaying
          ? `Listening to ${snap.streamUrl}`
          : "Stopped"}
      </Badge>
    </div>
  );
};
