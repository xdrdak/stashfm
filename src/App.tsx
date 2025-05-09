import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { bindRadioStoreToAudioElement } from "./stores/radio";
import { RadioStationsList } from "./features/radio-station/radio-stations-list";
import { RadioStationForm } from "./features/radio-station/radio-station-form";
import { Layout } from "./components/layout";
import { RadioPlayPauseButton } from "./features/radio-player/radio-player-play-pause-button";
import { RadioVolumeControl } from "./features/radio-player/radio-volume-control";
import { RadioPlayerStatusBadge } from "./features/radio-player/radio-player-status-badge";
import { AuthenticationButton } from "./features/authentication/authentication-button";
import { RadioStationSearch } from "./features/radio-station-search/radio-station-search";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const destroy = bindRadioStoreToAudioElement();
    // Clean up event listeners on unmount
    return () => {
      destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout
        expanderContent={
          <div className="container mx-auto py-8 max-w-4xl flex flex-col gap-4">
            <div className="flex justify-end gap-4">
              <RadioStationSearch />
              <RadioStationForm />
            </div>
            <RadioStationsList />
          </div>
        }
        barContent={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RadioPlayPauseButton />
              <RadioVolumeControl />
            </div>

            <RadioPlayerStatusBadge />
          </div>
        }
      >
        <div className="absolute top-3 right-3">
          <AuthenticationButton />
        </div>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
