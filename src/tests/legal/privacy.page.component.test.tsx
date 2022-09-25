import { render } from "@testing-library/react";
import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import Privacy from "@src/components/legal/privacy/privacy.component";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import Page from "@src/pages/legal/privacy";
import mockCheckCall from "@src/tests/fixtures/mock.component.call";
import getPageProps from "@src/utils/page.props.static";

jest.mock("@src/utils/page.props.static", () => jest.fn());

jest.mock("@src/components/errors/boundary/error.boundary.component", () =>
  createMockedComponent("ErrorBoundary")
);

jest.mock("@src/components/legal/privacy/privacy.component", () =>
  createMockedComponent("Privacy")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("getStaticProps", () => {
  it("should be generated by the correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({
      pageKey: "privacy",
      translations: ["legal"],
    });
  });
});

describe("Privacy", () => {
  const arrange = () => {
    render(<Page />);
  };

  beforeEach(() => jest.clearAllMocks());

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the ErrorBoundary component correctly", () => {
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

    it("should call the Privacy component", () => {
      expect(Privacy).toBeCalledTimes(1);
      mockCheckCall(Privacy, {});
    });
  });
});
