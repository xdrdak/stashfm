import { RadioBrowserApi, StationSearchType } from "radio-browser-api";

export type RadioBrowserStation = {
  name: string;
  url: string;
  description: string;
};

class RadioBrowserApiClient {
  private api: RadioBrowserApi;

  constructor(appName?: string) {
    this.api = new RadioBrowserApi(appName ?? "Stash.fm");
  }

  async search(
    term: string,
    searchType: keyof typeof StationSearchType = "byName"
  ): Promise<RadioBrowserStation[]> {
    const results = await this.api.getStationsBy(searchType, term);

    return results.map((result) => {
      return {
        name: result.name,
        url: result.url,
        description: result.tags.join(", "),
      };
    });
  }
}

export const radioBrowserApiClient = new RadioBrowserApiClient();
