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
import { Trash2, Edit, PlayCircle } from "lucide-react";
import { useSnapshot } from "valtio";
import { radioStationsStore, deleteRadioStation } from "@/stores/radio-stations";
import { playFromUrl } from "@/stores/radio";

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
              const streamName = entry.name || new URL(entry.url).host;

              return (
                <TableRow key={entry.url}>
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
                      <Button aria-label="edit" variant="ghost" size="icon">
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
                            <AlertDialogTitle>
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the station "
                              {streamName}".
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
