import type { LastFMTopArtistsReportResponseInterface } from "@src/types/clients/api/lastfm/response.types";

interface TestData {
  [key: string]: LastFMTopArtistsReportResponseInterface;
}

const testResponses: TestData = {
  noListens: {
    artists: [],
    image: [
      {
        size: "small",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/34s/ed8121273747692b2509dbda32f2d516.png",
      },
      {
        size: "medium",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/64s/ed8121273747692b2509dbda32f2d516.png",
      },
      {
        size: "large",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/174s/ed8121273747692b2509dbda32f2d516.png",
      },
      {
        size: "extralarge",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/300x300/ed8121273747692b2509dbda32f2d516.png",
      },
    ],
    playcount: 0,
  },
  hasListens: {
    artists: [
      {
        "@attr": {
          rank: "1",
        },
        image: [
          {
            size: "small",
            "#text": "",
          },
          {
            size: "medium",
            "#text": "",
          },
          {
            size: "large",
            "#text": "",
          },
          {
            size: "extralarge",
            "#text": "",
          },
          {
            size: "mega",
            "#text": "",
          },
        ],
        playcount: "1",
        streamable: "0",
        url: "https://www.last.fm/music/Non+Offensive+Scrobble",
        name: "Non Offensive Scrobble",
        mbid: "",
      },
    ],
    image: [
      {
        size: "small",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/34s/632f1fc23f8010119928baa64ae9f44b.png",
      },
      {
        size: "medium",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/64s/632f1fc23f8010119928baa64ae9f44b.png",
      },
      {
        size: "large",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/174s/632f1fc23f8010119928baa64ae9f44b.png",
      },
      {
        size: "extralarge",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/300x300/632f1fc23f8010119928baa64ae9f44b.png",
      },
    ],
    playcount: 1,
  },
};

export default testResponses;
