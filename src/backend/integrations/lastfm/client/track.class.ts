import LastFMClientAdapterBase from "./client.base.class";
import type { LastFMTrackInfoInterface } from "@src/types/integrations/lastfm/api.types";
import type {
  LastFMExternalClientError,
  LastFMTrackClientInterface,
} from "@src/types/integrations/lastfm/client.types";

class LastFmTrackClientAdapter
  extends LastFMClientAdapterBase
  implements LastFMTrackClientInterface
{
  async getInfo(
    artist: string,
    track: string,
    username: string
  ): Promise<LastFMTrackInfoInterface> {
    try {
      const response = await this.externalClient.track.getInfo({
        artist,
        track,
        username,
      });
      return response.track as LastFMTrackInfoInterface;
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMExternalClientError);
    }
  }
}

export default LastFmTrackClientAdapter;
