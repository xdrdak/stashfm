import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  radioBrowserApiClient,
  type RadioBrowserStation,
} from "./internal/radio-browser-api.client";
import { RadioPlayFromUrlButton } from "../radio-player/radio-play-from-url-button";
import { addRadioStation, radioStationsStore } from "@/stores/radio-stations";
import { useSnapshot } from "valtio";

export function RadioStationSearch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["radioStations", searchTerm],
    queryFn: (opts) => {
      const [, term] = opts.queryKey;
      return radioBrowserApiClient.search(term, "byName");
    },
    enabled: Boolean(searchTerm),
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsModalOpen(true)}>
          <SearchIcon className="mr-2 h-4 w-4" /> Search Stations
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[70vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Search Radio Stations</DialogTitle>
          <DialogDescription>
            Find new radio stations by entering a search term below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 py-2">
          <Input
            ref={inputRef}
            placeholder="Search by name, genre, etc."
            className="flex-grow"
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputRef.current) {
                setSearchTerm(inputRef.current.value);
              }
            }}
          />
          <Button
            onClick={() => {
              if (inputRef.current) {
                setSearchTerm(inputRef.current.value);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
        <div className="overflow-auto border rounded h-full">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading stations...
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-8">
              Error loading stations. Please try again.
            </div>
          ) : searchResults.length > 0 ? (
            <table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[7%] sticky top-0 bg-white"></TableHead>
                  <TableHead className="w-[43%] sticky top-0 bg-white">
                    Name
                  </TableHead>
                  <TableHead className="w-[35%] sticky top-0 bg-white">
                    Description
                  </TableHead>
                  <TableHead className="w-[15%] sticky top-0 bg-white"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((station, index) => {
                  return (
                    <RadioStationResultRow
                      key={`${station.name}-${index}`}
                      station={station}
                    />
                  );
                })}
              </TableBody>
            </table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              {searchTerm
                ? "No stations found. Try a different search term."
                : "Enter a search term and click Search."}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const RadioStationResultRow = (props: { station: RadioBrowserStation }) => {
  const snap = useSnapshot(radioStationsStore);

  // @TODO: hashmap for o(1) lookup
  const isAlreadySaved = !!snap.stations.find(
    (s) => s.url === props.station.url
  );

  return (
    <TableRow className="*:max-w-0 *:truncate">
      <TableCell>
        <RadioPlayFromUrlButton url={props.station.url} />
      </TableCell>
      <TableCell>
        <div>
          <div>{props.station.name}</div>
          <div className="text-xs text-gray-700">{props.station.url}</div>
        </div>
      </TableCell>
      <TableCell>{props.station.description}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          disabled={isAlreadySaved}
          aria-label="Saved station"
          onClick={() => {
            addRadioStation({
              url: props.station.url,
              name: props.station.name,
              description: props.station.description,
            });
          }}
        >
          {isAlreadySaved ? (
            "Saved"
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-1" /> Save
            </>
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};
