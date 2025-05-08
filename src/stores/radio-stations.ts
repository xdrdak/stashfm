import { proxy } from "valtio";

type StreamEntry = {
  url: string;
  name: string;
  description: string;
};

type RadioStationsStore = {
  stations: StreamEntry[];
};

export const radioStationsStore = proxy<RadioStationsStore>({
  stations: [
    {
      url: "https://stream.rovr.live/live-01",
      description: "",
      name: "",
    },
  ],
});

export const addRadioStation = (entry: Omit<StreamEntry, "id">) => {
  // Add new entry to the table
  const newEntry: StreamEntry = {
    url: entry.url,
    name: entry.name,
    description: entry.description,
  };

  radioStationsStore.stations.push(newEntry);
};

export const deleteRadioStation = (url: string) => {
  radioStationsStore.stations = radioStationsStore.stations.filter(
    (station) => station.url !== url
  );
};
