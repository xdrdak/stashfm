import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useSnapshot } from "valtio";
import {
  radioStationFormStore,
  openRadioStationForm,
  closeRadioStationForm,
  resetRadioStationForm,
} from "@/stores/radio-station-form";
import { addRadioStation, updateRadioStation } from "@/stores/radio-stations";

export function RadioStationForm() {
  const formSnap = useSnapshot(radioStationFormStore);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const url = (formData.get("url") as string) || "";
    const name = (formData.get("name") as string) || "";
    const description = (formData.get("description") as string) || "";

    if (!url.trim()) {
      alert("Stream URL is required");
      return;
    }

    if (formSnap.mode === "add") {
      addRadioStation({ url, name, description });
    } else if (formSnap.mode === "edit" && formSnap.originalUrl) {
      updateRadioStation(formSnap.originalUrl, { url, name, description });
    }

    closeRadioStationForm();
  };

  return (
    <Dialog
      open={formSnap.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeRadioStationForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => openRadioStationForm({ mode: "add" })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Station
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {formSnap.mode === "add" ? "Add New Radio Station" : "Edit Radio Station"}
          </DialogTitle>
          <DialogDescription>
            {formSnap.mode === "add"
              ? "Fill in the details for the new radio station stream. Click submit when you're done."
              : "Update the details for the radio station stream. Click submit when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">
              Stream URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="url"
              name="url"
              placeholder="Enter stream URL"
              required
              defaultValue={formSnap.formData.url}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Stream Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter stream name"
              defaultValue={formSnap.formData.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter description"
              rows={3}
              defaultValue={formSnap.formData.description}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetRadioStationForm}>
              Reset
            </Button>
            <Button type="submit">
              {formSnap.mode === "add" ? "Submit" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
