import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit } from "lucide-react";
import { useSnapshot } from "valtio";
import {
  radioStationsStore,
  deleteRadioStation,
} from "@/stores/radio-stations";
import { openRadioStationForm } from "@/stores/radio-station-form";
import { RadioPlayFromUrlButton } from "../radio-player/radio-play-from-url-button";

export const RadioStationsList = () => {
  const radioStationSnap = useSnapshot(radioStationsStore);

  return (
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
          {radioStationSnap.stations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No stations available. Add a new station.
              </TableCell>
            </TableRow>
          ) : (
            radioStationSnap.stations.map((entry) => {
              const url = new URL(entry.url);

              let streamName = entry.name;

              if (!streamName) {
                streamName = url.host;
              }

              return (
                <TableRow key={entry.url}>
                  <TableCell>
                    <RadioPlayFromUrlButton url={entry.url} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{streamName}</span>
                      <span className="text-xs text-gray-700">
                        {[url.host, url.pathname].join("")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {entry.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        aria-label="edit"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          openRadioStationForm({
                            mode: "edit",
                            stationUrl: entry.url,
                          })
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            aria-label="delete"
                            variant="ghost"
                            size="icon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the station "{streamName}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteRadioStation(entry.url)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
