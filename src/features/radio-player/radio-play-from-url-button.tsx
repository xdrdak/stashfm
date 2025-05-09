import { Button } from "@/components/ui/button";
import { playFromUrl, radioStore } from "@/stores/radio";
import { CirclePause, PlayCircle } from "lucide-react";
import { useSnapshot } from "valtio";

export const RadioPlayFromUrlButton = (props: { url: string }) => {
  const snap = useSnapshot(radioStore);
  const isPlaying = snap.streamUrl === props.url;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        playFromUrl({
          url: props.url,
        });
      }}
    >
      {isPlaying ? (
        <CirclePause className="h-4 w-4" />
      ) : (
        <PlayCircle className="h-4 w-4" />
      )}
    </Button>
  );
};
