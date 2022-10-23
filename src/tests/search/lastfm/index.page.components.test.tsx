import { render } from "@testing-library/react";
import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import Select from "@src/components/search/lastfm/select/select.report.component";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import Page, { getServerSideProps } from "@src/pages/search/lastfm/index";
import mockCheckCall from "@src/tests/fixtures/mock.component.call";
import mockServerSideProps from "@src/utils/__mocks__/page.props.server.side.mock";
import getPageProps from "@src/utils/page.props.server.side";

jest.mock("@src/utils/page.props.server.side");

jest.mock("@src/components/search/lastfm/select/select.report.component", () =>
  require("@fixtures/react/child").createComponent("SelectComponent")
);

jest.mock("@src/components/errors/boundary/error.boundary.component", () =>
  require("@fixtures/react/parent").createComponent("ErrorBoundary")
);

jest.mock("@src/components/errors/display/error.display.component", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplay")
);

describe("getStaticProps", () => {
  it("should be the return value of pagePropsGenerator", () => {
    expect(getServerSideProps).toBe(mockServerSideProps);
  });

  it("should be generated by a correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({
      pageKey: "search",
      translations: ["lastfm"],
    });
  });
});

describe("SearchSelectionPage", () => {
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

    it("should call the Select correctly", () => {
      expect(Select).toBeCalledTimes(1);
      mockCheckCall(Select, { scrollRef: { current: null } }, 0);
    });
  });
});
