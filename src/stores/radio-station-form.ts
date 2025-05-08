import { proxy } from "valtio";
import { StreamEntry, radioStationsStore } from "./radio-stations";

export type FormMode = "add" | "edit";

const initialFormData: StreamEntry = {
  url: "",
  name: "",
  description: "",
};

type RadioStationFormState = {
  isOpen: boolean;
  mode: FormMode;
  formData: StreamEntry;
  originalUrl?: string; // To identify the station being edited for update and reset
};

export const radioStationFormStore = proxy<RadioStationFormState>({
  isOpen: false,
  mode: "add",
  formData: { ...initialFormData },
  originalUrl: undefined,
});

export function openRadioStationForm(mode: FormMode, station?: StreamEntry) {
  radioStationFormStore.mode = mode;
  if (mode === "edit" && station) {
    radioStationFormStore.formData = { ...station };
    radioStationFormStore.originalUrl = station.url;
  } else {
    radioStationFormStore.formData = { ...initialFormData };
    radioStationFormStore.originalUrl = undefined;
  }
  radioStationFormStore.isOpen = true;
}

export function closeRadioStationForm() {
  radioStationFormStore.isOpen = false;
  // Optionally, reset form data after a delay for smoother UI,
  // but typically resetting on open is sufficient.
  // setTimeout(() => {
  //   radioStationFormStore.formData = { ...initialFormData };
  //   radioStationFormStore.originalUrl = undefined;
  //   radioStationFormStore.mode = "add";
  // }, 300);
}

export function updateRadioStationFormField<K extends keyof StreamEntry>(
  field: K,
  value: StreamEntry[K]
) {
  radioStationFormStore.formData[field] = value;
}

export function resetRadioStationForm() {
  if (radioStationFormStore.mode === "edit" && radioStationFormStore.originalUrl) {
    const stationToEdit = radioStationsStore.stations.find(
      (s) => s.url === radioStationFormStore.originalUrl
    );
    if (stationToEdit) {
      radioStationFormStore.formData = { ...stationToEdit };
    } else {
      // Fallback if original station is somehow gone (e.g., deleted in background)
      radioStationFormStore.formData = { ...initialFormData };
    }
  } else {
    // For 'add' mode
    radioStationFormStore.formData = { ...initialFormData };
  }
}
