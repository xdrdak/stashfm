import { useEffect } from "react";
import {
  RadioPlayPauseButton,
  RadioVolumeControl,
  RadioPlayerStatus,
} from "./components/radio-player";
import { bindRadioStoreToAudioElement } from "./stores/radio";
import { RadioStationsList } from "./components/radio-stations";
import { Layout } from "./components/layout";

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
        <div className="flex items-center gap-3">
          <RadioPlayPauseButton />
          <RadioVolumeControl />
          <RadioPlayerStatus />
        </div>
      }
    >
      <div className="container mx-auto py-8 max-w-4xl flex flex-col gap-4">
        <RadioStationsList />
      </div>
    </Layout>
  );
}

export default App;
