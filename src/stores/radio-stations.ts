import { proxy, subscribe } from "valtio";
import z from "zod";

const StreamEntrySchema = z.object({
  url: z.string(),
  name: z.string(),
  description: z.string(),
});

export type StreamEntry = z.infer<typeof StreamEntrySchema>;

export const RadioStationStoreSchema = z.object({
  owner: z.string(),
  stations: z.array(StreamEntrySchema),
});

export type RadioStationsStore = z.infer<typeof RadioStationStoreSchema>;

const initialState = {
  owner: "anonymous",
  stations: [
    {
      url: "https://stream.rovr.live/live-01",
      description: "",
      name: "",
    },
    {
      url: "https://stream.rovr.live/live-02",
      description: "",
      name: "",
    },
    {
      url: "https://n10as.radiocult.fm/stream",
      description: "",
      name: "",
    },
    {
      url: "https://dublab.out.airtime.pro/dublab_a",
      description: "",
      name: "",
    },
    {
      url: "https://dublab.out.airtime.pro/dublab_b",
      description: "",
      name: "",
    },
    {
      url: "https://dublab.out.airtime.pro/dublab_c",
      description: "",
      name: "",
    },
    {
      url: "https://stream-relay-geo.ntslive.net/stream",
      description: "live",
      name: "Channel 1",
    },
    {
      url: "https://stream-relay-geo.ntslive.net/stream2",
      description: "live",
      name: "Channel 2",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape4",
      description: "mixtape",
      name: "Poolside",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape",
      description: "mixtape",
      name: "Slow Focus",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape2",
      description: "mixtape",
      name: "Low Key",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape6",
      description: "mixtape",
      name: "Memory Lane",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape5",
      description: "mixtape",
      name: "4 To The Floor",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape21",
      description: "mixtape",
      name: "Island Time",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape26",
      description: "mixtape",
      name: "The Tube",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape35",
      description: "mixtape",
      name: "Sheet Music",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape27",
      description: "mixtape",
      name: "Feelings",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape3",
      description: "mixtape",
      name: "Expansions",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape22",
      description: "mixtape",
      name: "Rap House",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape31",
      description: "mixtape",
      name: "Labyrinth",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape24",
      description: "mixtape",
      name: "Sweat",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape36",
      description: "mixtape",
      name: "Otaku",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape34",
      description: "mixtape",
      name: "The Pit",
    },
    {
      url: "https://stream-mixtape-geo.ntslive.net/mixtape23",
      description: "mixtape",
      name: "Field Recordings",
    },
  ],
} satisfies RadioStationsStore;

export const radioStationsStore = proxy<RadioStationsStore>(
  loadStoreFromLocalStorage("anonymous")
);

export const addRadioStation = (station: StreamEntry) => {
  const existingStation = radioStationsStore.stations.find(
    (s) => s.url === station.url
  );
  if (existingStation) {
    // Optionally, handle this more gracefully in the UI
    alert(`A station with URL "${station.url}" already exists.`);
    return;
  }
  radioStationsStore.stations.push(station);
};

export const deleteRadioStation = (url: string) => {
  radioStationsStore.stations = radioStationsStore.stations.filter(
    (station) => station.url !== url
  );
};

export function updateRadioStation(
  originalUrl: string,
  updatedStationData: StreamEntry
) {
  const stationIndex = radioStationsStore.stations.findIndex(
    (s) => s.url === originalUrl
  );

  if (stationIndex !== -1) {
    // Check if the new URL conflicts with another existing station's URL (excluding itself)
    if (updatedStationData.url !== originalUrl) {
      const conflictingStation = radioStationsStore.stations.find(
        (s, index) => s.url === updatedStationData.url && index !== stationIndex
      );
      if (conflictingStation) {
        alert(
          `Another station with the URL "${updatedStationData.url}" already exists.`
        );
        return; // Prevent update due to URL conflict
      }
    }
    // Update the station at the found index
    radioStationsStore.stations[stationIndex] = { ...updatedStationData };
  } else {
    console.error(
      "Station to update not found with original URL:",
      originalUrl
    );
    // Optionally, handle this more gracefully in the UI
    alert("Error: Could not find the station to update.");
  }
}

export function setRadioStationStore(store: RadioStationsStore) {
  radioStationsStore.owner = store.owner;
  radioStationsStore.stations = store.stations;
}

function getLocalStorageKey(user: string) {
  const key = `stations:${user}`;
  return key;
}

export function loadStoreFromLocalStorage(user: string): RadioStationsStore {
  const item = localStorage.getItem(getLocalStorageKey(user)) ?? "";

  if (!item) {
    return initialState;
  }

  const result = RadioStationStoreSchema.safeParse(JSON.parse(item));

  if (result.success) {
    return result.data;
  }

  return initialState;
}

function persistRadioStationStore() {
  window.localStorage.setItem(
    getLocalStorageKey(radioStationsStore.owner),
    JSON.stringify(radioStationsStore.stations)
  );
}

subscribe(radioStationsStore, () => {
  persistRadioStationStore();
});
