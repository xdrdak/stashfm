import { proxy } from "valtio";

export type StreamEntry = { // Export the type
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

export const addRadioStation = (station: StreamEntry) => {
  const existingStation = radioStationsStore.stations.find(s => s.url === station.url);
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

export function updateRadioStation(originalUrl: string, updatedStationData: StreamEntry) {
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
        alert(`Another station with the URL "${updatedStationData.url}" already exists.`);
        return; // Prevent update due to URL conflict
      }
    }
    // Update the station at the found index
    radioStationsStore.stations[stationIndex] = { ...updatedStationData };
  } else {
    console.error("Station to update not found with original URL:", originalUrl);
    // Optionally, handle this more gracefully in the UI
    alert("Error: Could not find the station to update.");
  }
}
