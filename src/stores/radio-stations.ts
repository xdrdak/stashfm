import { proxy } from "valtio";

type StreamEntry = {
  id: number;
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
      id: 1,
      url: "https://stream.rovr.live/live-01",
      description: "",
      name: "",
    },
  ],
});

export const addRadioStation = (entry: StreamEntry) => {
  // Add new entry to the table
  const newEntry: StreamEntry = {
    id: entry.id,
    url: entry.url,
    name: entry.name,
    description: entry.description,
  };

  radioStationsStore.stations.push(newEntry);
};
