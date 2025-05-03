"use client";

import { useState, useRef, useEffect } from "react";
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

export default function RadioPlayer() {
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element on component mount
    audioRef.current = new Audio();

    // Set up event listeners
    const audio = audioRef.current;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsBuffering(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleError = () => {
      setError("Error loading stream. Please check the URL and try again.");
      setIsPlaying(false);
      setIsBuffering(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("playing", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("error", handleError);

    // Set initial volume
    audio.volume = volume / 100;

    // Clean up event listeners on unmount
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("playing", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("error", handleError);

      // Stop audio on unmount
      audio.pause();
      audio.src = "";

      // Clear timer interval on unmount
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      // Stop the timer when paused
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    } else {
      setError(null);

      if (!streamUrl.trim()) {
        setError("Please enter a stream URL");
        return;
      }

      // Only set a new source if we need to
      if (audio.src !== streamUrl) {
        audio.src = streamUrl;
        // Reset timer when changing stream
        setElapsedTime(0);
      }

      setIsBuffering(true);
      audio.play().catch((err) => {
        setError("Failed to play stream: " + err.message);
        setIsBuffering(false);
      });

      // Start the timer when playing
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  useEffect(() => {
    // Reset timer when stream URL changes
    setElapsedTime(0);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [streamUrl]);

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
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            className="w-full"
          />
        </div>

        {error && (
          <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            onClick={handlePlayPause}
            variant="outline"
            disabled={isBuffering && !isPlaying}
            className="w-24"
          >
            {isBuffering && !isPlaying ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></span>
                Loading
              </span>
            ) : isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Play
              </>
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
            <span className="text-xs w-8">{volume}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-center">
          <Badge variant={isPlaying ? "default" : "outline"}>
            {isBuffering ? "Buffering..." : isPlaying ? "Playing" : "Stopped"}
          </Badge>
        </div>
        <div className="text-sm font-mono">
          {isPlaying && (
            <span className="inline-flex items-center">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              {formatTime(elapsedTime)}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
