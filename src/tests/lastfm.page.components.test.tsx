import { render } from "@testing-library/react";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import Top20Report from "../components/reports/lastfm/top20/top20.container.component";
import Events from "../config/events";
import routes from "../config/routes";
import mockLastFMHook from "../hooks/tests/lastfm.mock";
import FourOhFour from "../pages/404";
import Page from "../pages/lastfm";
import mockCheckCall from "../tests/fixtures/mock.component.call";
import getPageProps from "../utils/page.props.static";

jest.mock("../utils/page.props.static", () => jest.fn());

jest.mock("../components/errors/boundary/error.boundary.component", () =>
  createMockedComponent("ErrorBoundary")
);

jest.mock("../components/reports/lastfm/top20/top20.component", () =>
  createMockedComponent("Top20Report")
);

jest.mock("../components/reports/lastfm/top20/top20.container.component", () =>
  createMockedComponent("Top20Report")
);

jest.mock("../pages/404", () => createMockedComponent("FourOhFour"));

jest.mock("../hooks/lastfm", () => () => mockLastFMHook);

const mockWindowResponse = jest.fn();

Object.defineProperty(window, "location", {
  value: {
    hash: {
      endsWith: mockWindowResponse,
      includes: mockWindowResponse,
    },
    assign: mockWindowResponse,
  },
  writable: true,
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("getStaticProps", () => {
  it("should be generated by the correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({
      pageKey: "lastfm",
      translations: ["lastfm"],
    });
  });
});

describe("lastfm", () => {
  const testUser = "someuser";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<Page />);
  };

  describe("when rendered", () => {
    describe("with a proper query string", () => {
      beforeEach(() => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("username", testUser);
        window.location.search = searchParams.toString();
        arrange();
      });

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

      it("should call the Top20Report correctly", () => {
        expect(Top20Report).toBeCalledTimes(1);
        mockCheckCall(
          Top20Report,
          {
            username: testUser,
            user: mockLastFMHook,
          },
          0,
          ["stateReset"]
        );
      });
    });

    describe("without a proper query string", () => {
      beforeEach(() => arrange());

      it("should call the FourOhFour correctly", () => {
        expect(FourOhFour).toBeCalledTimes(1);
        mockCheckCall(FourOhFour, {});
      });
    });
  });
});
