import { render } from "@testing-library/react";
import routes from "@src/config/routes";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import Page, { getServerSideProps } from "@src/pages/about";
import {
  mockServerSideProps,
  mockUtilities,
} from "@src/vendors/integrations/web.framework/__mocks__/vendor.ssr.mock";
import Events from "@src/web/analytics/collection/events/definitions";
import AboutContainer from "@src/web/content/about/components/about.container";
import ErrorBoundaryContainer from "@src/web/ui/errors/components/boundary/error.boundary.container";

jest.mock("@src/vendors/integrations/web.framework/vendor.ssr");

jest.mock(
  "@src/web/ui/errors/components/boundary/error.boundary.container",
  () => require("@fixtures/react/parent").createComponent("ErrorBoundary")
);

jest.mock("@src/web/content/about/components/about.container", () =>
  require("@fixtures/react/parent").createComponent("AboutContainer")
);

describe("getServerSideProps", () => {
  it("should be the return value of serverSideProps", () => {
    expect(getServerSideProps).toBe(mockServerSideProps);
  });

  it("should be generated by a correct call to serverSideProps", () => {
    expect(mockUtilities.serverSideProps).toHaveBeenCalledTimes(1);
    expect(mockUtilities.serverSideProps).toHaveBeenCalledWith({
      pageKey: "home",
      translations: ["about"],
    });
  });
});

describe("About", () => {
  const arrange = () => {
    render(<Page />);
  };

  beforeEach(() => jest.clearAllMocks());

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the ErrorBoundary component correctly", () => {
      expect(ErrorBoundaryContainer).toHaveBeenCalledTimes(1);
      checkMockCall(
        ErrorBoundaryContainer,
        {
          route: routes.home,
          eventDefinition: Events.General.Error,
        },
        0,
        ["stateReset"]
      );
    });

    it("should call the Splash component", () => {
      expect(AboutContainer).toHaveBeenCalledTimes(1);
      checkMockCall(AboutContainer, {});
    });
  });
});
