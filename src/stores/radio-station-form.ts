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

// Overload signatures
export function openRadioStationForm(mode: "add"): void;
export function openRadioStationForm(mode: "edit", stationUrl: string): void;

// Implementation signature
export function openRadioStationForm(mode: FormMode, stationUrl?: string): void {
  radioStationFormStore.mode = mode;
  if (mode === "edit") {
    // stationUrl is guaranteed to be a string here by the overload signature if mode is 'edit'
    const stationToEdit = radioStationsStore.stations.find(
      (s) => s.url === stationUrl! // Non-null assertion as TS knows it's string here
    );
    if (stationToEdit) {
      radioStationFormStore.formData = { ...stationToEdit };
      radioStationFormStore.originalUrl = stationToEdit.url;
    } else {
      // Station not found, perhaps log an error or handle gracefully
      // For now, reset to add mode or keep dialog closed
      console.error(`Station with URL "${stationUrl!}" not found for editing.`);
      radioStationFormStore.formData = { ...initialFormData };
      radioStationFormStore.originalUrl = undefined;
      radioStationFormStore.isOpen = false; // Don't open if station not found
      return; // Exit early
    }
  } else if (mode === "add") {
    // For 'add' mode
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
