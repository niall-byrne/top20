import { render } from "@testing-library/react";
import lastfmTranslations from "../../../../public/locales/en/lastfm.json";
import ErrorBoundary from "../../../components/errors/boundary/error.boundary.component";
import SearchUI from "../../../components/search/lastfm/search.ui.component";
import routes from "../../../config/routes";
import Events from "../../../events/events";
import Page from "../../../pages/search/lastfm/playCountByArtist";
import mockCheckCall from "../../../tests/fixtures/mock.component.call";
import getPageProps from "../../../utils/page.props.static";

jest.mock("../../../utils/page.props.static", () => jest.fn());

jest.mock("../../../components/errors/boundary/error.boundary.component", () =>
  createMockedComponent("ErrorBoundary")
);

jest.mock("../../../components/search/lastfm/search.ui.component", () =>
  createMockedComponent("SearchUI")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("getStaticProps", () => {
  it("should be generated by the correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({
      pageKey: "search",
      translations: ["lastfm"],
    });
  });
});

describe("SearchTopAlbums", () => {
  const arrange = () => {
    render(<Page />);
  };

  beforeEach(() => jest.clearAllMocks());

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the ErrorBoundary correctly", () => {
      expect(ErrorBoundary).toBeCalledTimes(1);
      mockCheckCall(
        ErrorBoundary,
        {
          route: routes.home,
          eventDefinition: Events.General.Error,
        },
        0,
        ["stateReset"]
      );
    });

    it("should call the ErrorDisplay correctly", () => {
      expect(SearchUI).toBeCalledTimes(1);
      mockCheckCall(
        SearchUI,
        {
          route: routes.reports.lastfm.playCountByArtist,
          title: lastfmTranslations.playCountByArtist.searchTitle,
        },
        0,
        ["t"]
      );
    });
  });
});
