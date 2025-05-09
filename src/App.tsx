import { useEffect } from "react";
import { bindRadioStoreToAudioElement } from "./stores/radio";
import { RadioStationsList } from "./components/radio-stations";
import { RadioStationForm } from "@/components/radio-station-form";
import { Layout } from "./components/layout";
import { RadioPlayPauseButton } from "./components/radio-player/radio-player-play-pause-button";
import { RadioVolumeControl } from "./components/radio-player/radio-volume-control";
import { RadioPlayerStatusBadge } from "./components/radio-player/radio-player-status-badge";

function App() {
  useEffect(() => {
    const destroy = bindRadioStoreToAudioElement();
    // Clean up event listeners on unmount
    return () => {
      destroy();
    };
  }, []);

  return (
    <Layout
      barContent={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RadioPlayPauseButton />
            <RadioPlayerStatusBadge />
          </div>

          <RadioVolumeControl />
        </div>
      }
    >
      <div className="container mx-auto py-8 max-w-4xl flex flex-col gap-4">
        <div className="flex justify-end">
          <RadioStationForm />
        </div>
        <RadioStationsList />
      </div>
    </Layout>
  );
}

export default App;
