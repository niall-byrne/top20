import type { UserActionType } from "./action.types";
import type { UserReportType } from "./report.types";
import type {
  LastFMTopBaseReportResponseInterface,
  LastFMTopAlbumsReportResponseInterface,
  LastFMTopArtistsReportResponseInterface,
  LastFMTopTracksReportResponseInterface,
  LastFMPlayCountByArtistResponseInterface,
} from "@src/types/clients/api/lastfm/response.types";

interface UserDataInterface {
  integration: string | null;
  report: UserReportType;
}

export interface UserStateInterface {
  data: UserDataInterface;
  error: null | UserActionType["type"];
  inProgress: boolean;
  profileUrl: string | null;
  ready: boolean;
  retries: number;
  userName: string | null;
}

export interface LastFMUserStateBase extends UserStateInterface {
  data: {
    report: LastFMTopBaseReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMUserStateAlbumReport extends UserStateInterface {
  data: {
    report: LastFMTopAlbumsReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMUserStateArtistReport extends UserStateInterface {
  data: {
    report: LastFMTopArtistsReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMUserStateTrackReport extends UserStateInterface {
  data: {
    report: LastFMTopTracksReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMUserStatePlayCountByArtistReport
  extends UserStateInterface {
  data: {
    report: LastFMPlayCountByArtistResponseInterface;
    integration: "LASTFM";
  };
}
