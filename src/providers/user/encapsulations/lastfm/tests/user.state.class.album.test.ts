import UserAlbumState from "../user.state.album.class";
import type {
  LastFMAlbumDataInterface,
  LastFMArtistDataInterface,
} from "../../../../../types/integrations/lastfm/api.types";
import type { LastFMUserStateAlbumReport } from "../../../../../types/user/state.types";
import type { UserStateInterface } from "../../../../../types/user/state.types";

describe("UserAlbumState", () => {
  let currentState: LastFMUserStateAlbumReport;
  let instance: UserAlbumState;
  const mockT = jest.fn((arg: string) => `t(${arg})`);
  let index: number;
  const mockUrls = ["http://someurl1.com", "http://someurl2.com"];
  const baseUserProperties: UserStateInterface = {
    data: {
      integration: null,
      report: {
        albums: [
          {
            mbid: "Mock mbid value.",
            artist: {
              mbid: "Another mock mbid value",
            },
            image: [
              {
                size: "large" as const,
                "#text": mockUrls[0],
              },
            ],
          },
        ],
        image: [
          {
            size: "small" as const,
            "#text": mockUrls[1],
          },
        ],
      },
    },
    error: null,
    inProgress: false,
    profileUrl: null,
    ready: true,
    retries: 3,
    userName: null,
  };

  const resetState = () => {
    currentState = JSON.parse(JSON.stringify(baseUserProperties));
  };

  const arrange = () => {
    instance = new UserAlbumState(currentState, mockT);
  };

  beforeEach(() => {
    resetState();
  });

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("getDataSource", () => {
      let data: LastFMAlbumDataInterface[];

      beforeEach(() => {
        data = instance.getDataSource();
      });

      it("should return the correct data", () => {
        expect(data).toBe(instance.userProperties.data.report.albums);
      });
    });
  });

  describe("with a VALID album index value", () => {
    beforeEach(() => (index = 0));

    describe("getDrawerEvent", () => {
      const mockAlbumName = "mockAlbumName";
      const mockArtistName = "mockArtistName";

      describe("when an album name and artist name are defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].name = mockAlbumName;
          (
            currentState.data.report.albums[0]
              .artist as LastFMArtistDataInterface
          ).name = mockArtistName;
          arrange();
        });

        it("should return the correct event", () => {
          expect(instance.getDrawerEvent(index)).toEqual({
            category: "LAST.FM",
            label: "DATA: ALBUM",
            action: `VIEWED ALBUM DETAILS: ${mockArtistName}:${mockAlbumName}.`,
            value: undefined,
          });
        });
      });

      describe("when an album name and artist name are NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].name = undefined;
          (
            currentState.data.report.albums[0]
              .artist as LastFMArtistDataInterface
          ).name = undefined;
          arrange();
        });

        it("should return the correct event", () => {
          expect(instance.getDrawerEvent(index)).toEqual({
            category: "LAST.FM",
            label: "DATA: ALBUM",
            action: `VIEWED ALBUM DETAILS: ${instance.defaultArtistName}:${instance.defaultAlbumName}.`,
            value: undefined,
          });
        });
      });
    });

    describe("getDrawerTitle", () => {
      const mockAlbumName = "mockAlbumName";
      const mockArtistName = "mockArtistName";

      describe("when an album name and artist name are defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].name = mockAlbumName;
          (
            currentState.data.report.albums[0]
              .artist as LastFMArtistDataInterface
          ).name = mockArtistName;
          arrange();
        });

        it("should return the correct title", () => {
          expect(instance.getDrawerTitle(index)).toBe(
            `${mockArtistName}: ${mockAlbumName}`
          );
        });
      });

      describe("when an album name and artist name are NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].name = undefined;
          (
            currentState.data.report.albums[0]
              .artist as LastFMArtistDataInterface
          ).name = undefined;
          arrange();
        });

        it("should return the default title", () => {
          expect(instance.getDrawerTitle(index)).toBe(
            `${instance.defaultArtistName}: ${instance.defaultAlbumName}`
          );
        });
      });
    });

    describe("getRelatedArtistName", () => {
      const mockArtistName = "mockArtistName";

      describe("when an artist name is defined", () => {
        beforeEach(() => {
          (
            currentState.data.report.albums[0]
              .artist as LastFMArtistDataInterface
          ).name = mockArtistName;
          arrange();
        });

        it("should return the name", () => {
          expect(instance.getRelatedArtistName(index)).toBe(mockArtistName);
        });
      });

      describe("when an artist name is NOT defined", () => {
        beforeEach(() => {
          (
            currentState.data.report.albums[0]
              .artist as LastFMArtistDataInterface
          ).name = undefined;
          arrange();
        });

        it("should return the default name", () => {
          expect(instance.getRelatedArtistName(index)).toBe(
            instance.defaultArtistName
          );
        });
      });
    });

    describe("getExternalLink", () => {
      const mockUrl = "http://some.com/url";

      describe("when the album link is defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].url = mockUrl;
          arrange();
        });

        it("should return the name", () => {
          expect(instance.getExternalLink(index)).toBe(mockUrl);
        });
      });

      describe("when the album link is NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].url = undefined;
          arrange();
        });

        it("should return the default name (url encoded)", () => {
          instance.defaultAlbumName = "has a space";
          expect(instance.getExternalLink(index)).toBe(
            `${instance.lastfmPrefix}/${
              instance.defaultArtistName
            }/${encodeURIComponent(instance.defaultAlbumName)}`
          );
        });
      });
    });
  });

  describe("with an INVALID album index value", () => {
    beforeEach(() => (index = 1));

    describe("getDrawerEvent", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the correct event", () => {
        expect(instance.getDrawerEvent(index)).toEqual({
          category: "LAST.FM",
          label: "DATA: ALBUM",
          action: `VIEWED ALBUM DETAILS: ${instance.defaultArtistName}:${instance.defaultAlbumName}.`,
          value: undefined,
        });
      });
    });

    describe("getDrawerTitle", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the default title", () => {
        expect(instance.getDrawerTitle(index)).toBe(
          `${instance.defaultArtistName}: ${instance.defaultAlbumName}`
        );
      });
    });

    describe("getRelatedArtistName", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the default name", () => {
        expect(instance.getRelatedArtistName(index)).toBe(
          instance.defaultArtistName
        );
      });
    });

    describe("getExternalLink", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the default name (url encoded)", () => {
        instance.defaultAlbumName = "has a space";
        expect(instance.getExternalLink(index)).toBe(
          `${instance.lastfmPrefix}/${
            instance.defaultArtistName
          }/${encodeURIComponent(instance.defaultAlbumName)}`
        );
      });
    });
  });
});
