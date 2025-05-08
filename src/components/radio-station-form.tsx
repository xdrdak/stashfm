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
import { useRef } from "react";
import { addRadioStation } from "@/stores/radio-stations";

export function RadioStationForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const resetForm = () => {
    if (formRef.current) {
      const form = formRef.current;

      // Create a new FormData object to iterate over keys, then reset the actual form
      const formData = new FormData(form);
      for (const key of formData.keys()) {
        // This doesn't actually clear the form fields in the DOM for uncontrolled components.
        // form.reset() is more standard.
      }
      form.reset(); // Resets the form fields to their initial values
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Station
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Radio Station</DialogTitle>
          <DialogDescription>
            Fill in the details for the new radio station stream. Click submit when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          action={(formData) => {
            const url = formData.get("url")?.toString() ?? "";
            const name = formData.get("name")?.toString() ?? "";
            const description = formData.get("description")?.toString() ?? "";

            if (!url.trim()) {
              alert("Stream URL is required");
              return;
            }

            // Add new entry to the table
            addRadioStation({
              id: Date.now(),
              url,
              name,
              description,
            });

            // Clear form after successful submission
            resetForm();
            // TODO: Close dialog after submission
          }}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="url">
              Stream URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="url"
              name="url"
              placeholder="Enter stream URL"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Stream Name</Label>
            <Input id="name" name="name" placeholder="Enter stream name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter description"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
