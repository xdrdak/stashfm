import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit, PlayCircle } from "lucide-react";
import { useSnapshot } from "valtio";
import { radioStationsStore } from "@/stores/radio-stations";
import { playFromUrl } from "@/stores/radio";

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
