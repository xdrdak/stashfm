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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit, PlayCircle, PlusCircle } from "lucide-react";
import { useSnapshot } from "valtio";
import { useRef } from "react";
import { addRadioStation, radioStationsStore } from "@/stores/radio-stations";
import { playFromUrl } from "@/stores/radio";

export function RadioStations() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const resetForm = () => {
    if (formRef.current) {
      const form = formRef.current;

      const formData = new FormData(form);

      for (const key of formData.keys()) {
        formData.delete(key);
      }
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

export const RadioStationsList = () => {
  const radioStationSnap = useSnapshot(radioStationsStore);

  return (
    <>
      {radioStationSnap.stations.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-5">&nbsp;</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radioStationSnap.stations.map((entry) => {
                const streamName = entry.name || new URL(entry.url).host;

                return (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          playFromUrl({
                            url: entry.url,
                          });
                        }}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>{streamName}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};
