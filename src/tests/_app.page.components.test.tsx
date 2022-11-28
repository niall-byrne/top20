import { render, screen } from "@testing-library/react";
import App from "next/app";
import { createSimpleComponent } from "@fixtures/react/simple";
import { mockAuthVendorSSRClient } from "@src/clients/auth/__mocks__/vendor.ssr.mock";
import authVendorSSR from "@src/clients/auth/vendor.ssr";
import { mockFlagVendorSSRClient } from "@src/clients/flags/__mocks__/vendor.ssr.mock";
import flagVendorSSR from "@src/clients/flags/vendor.ssr";
import { mockLocaleVendorHOCIdentifier } from "@src/clients/locale/__mocks__/vendor.mock";
import ConsentContainer from "@src/components/consent/consent.container";
import NavBarContainer from "@src/components/navbar/navbar.container";
import RootPopUpContainer from "@src/components/popups/root.popup.container";
import NavConfig from "@src/config/navbar";
import MLA, { getInitialProps } from "@src/pages/_app";
import RootProvider from "@src/providers/root.provider";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import { normalizeUndefined } from "@src/utils/voids";
import type { VendorAuthStateType } from "@src/clients/auth/vendor.types";
import type { VendorFlagStateType } from "@src/clients/flags/vendor.types";
import type { AppContext, AppProps } from "next/app";
import type { Router } from "next/router";

jest.mock("@src/clients/auth/vendor.ssr");

jest.mock("@src/clients/flags/vendor.ssr");

jest.mock("@src/clients/locale/vendor");

jest.mock("@src/utils/voids");

jest.mock("next/app");

jest.mock("../../src/providers/root.provider", () =>
  require("@fixtures/react/parent").createComponent("RootProvider")
);

jest.mock("@src/components/navbar/navbar.container", () =>
  require("@fixtures/react/child").createComponent("NavBarContainer")
);

jest.mock("@src/components/popups/root.popup.container", () =>
  require("@fixtures/react/child").createComponent("RootPopUpContainer")
);

jest.mock("@src/components/consent/consent.container", () =>
  require("@fixtures/react/child").createComponent("ConsentContainer")
);

describe("MLA", () => {
  let currentProps: AppProps;
  const MockAppChildComponent = createSimpleComponent("MockAppChildComponent");

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const createProps = () => {
    currentProps = {
      Component: MockAppChildComponent,
      pageProps: {
        cookies: "mockCookies",
        flagState: "mockFlagState",
        session: "mockSession",
        headerProps: "mockHeaderProps",
        mockExtraProp: "mockExtraProp",
      },
      router: {} as Router,
    };
  };

  const arrange = () => {
    createProps();
    render(<MLA {...currentProps} />);
  };

  it("should render the RootProvider with the correct props", () => {
    expect(RootProvider).toBeCalledTimes(1);
    checkMockCall(RootProvider, {
      cookies: currentProps.pageProps.cookies,
      flagState: currentProps.pageProps.flagState,
      session: currentProps.pageProps.session,
      headerProps: currentProps.pageProps.headerProps,
    });
  });

  it("should render the NavBarContainer with the correct props", () => {
    expect(NavBarContainer).toBeCalledTimes(1);
    checkMockCall(NavBarContainer, { config: NavConfig.menuConfig });
  });

  it("should render the passed Component with the correct props", () => {
    expect(currentProps.Component).toBeCalledTimes(1);
    checkMockCall(currentProps.Component, {
      mockExtraProp: currentProps.pageProps.mockExtraProp,
    });
  });

  it("should render the RootPopUpContainer component with the correct props", () => {
    expect(RootPopUpContainer).toBeCalledTimes(1);
    checkMockCall(RootPopUpContainer, {});
  });

  it("should render the ConsentContainer component with the correct props", () => {
    expect(ConsentContainer).toBeCalledTimes(1);
    checkMockCall(ConsentContainer, {});
  });

  it("should wrap the MLA app in the appWithTranslation function", async () => {
    expect(
      await screen.findByTestId(mockLocaleVendorHOCIdentifier)
    ).toBeTruthy();
  });

  describe("getInitialProps", () => {
    let result: {
      pageProps: {
        cookies?: unknown;
        pageProps: unknown;
        session: VendorAuthStateType | undefined;
        flagState: VendorFlagStateType;
      };
    };
    const mockRequest = "mockRequest";
    const mockContext = {
      ctx: { req: mockRequest },
    } as unknown as AppContext;
    const mockSession = { group: "mockGroup" };
    const mockFlagState = "mockFlagState";
    const mockExtraProps = { pageProps: "mockPageProp" };

    beforeEach(async () => {
      jest.mocked(App.getInitialProps).mockResolvedValueOnce(mockExtraProps);
      mockAuthVendorSSRClient.getSession.mockReturnValue(mockSession);
      mockFlagVendorSSRClient.getState.mockReturnValue(mockFlagState);

      result = await getInitialProps(mockContext);
    });

    it("should call App.getInitialProps as expected", () => {
      expect(App.getInitialProps).toBeCalledTimes(1);
      expect(App.getInitialProps).toBeCalledWith(mockContext);
    });

    it("should call the authVendor's SSR Client getSession method as expected", () => {
      expect(authVendorSSR.Client).toBeCalledTimes(1);
      expect(authVendorSSR.Client).toBeCalledWith();
      expect(mockAuthVendorSSRClient.getSession).toBeCalledTimes(1);
      expect(mockAuthVendorSSRClient.getSession).toBeCalledWith({
        req: mockRequest,
      });
    });

    it("should call the flagVendor's SSR Client getState method as expected", () => {
      expect(flagVendorSSR.Client).toBeCalledTimes(1);
      expect(flagVendorSSR.Client).toBeCalledWith();
      expect(mockFlagVendorSSRClient.getState).toBeCalledTimes(1);
      expect(mockFlagVendorSSRClient.getState).toBeCalledWith(
        mockSession.group
      );
    });

    it("should wrap the session in a normalizeUndefined call", () => {
      expect(normalizeUndefined).toBeCalledTimes(1);
      expect(normalizeUndefined).toBeCalledWith(mockSession);
    });

    it("should return the expected values", () => {
      expect(result).toStrictEqual({
        pageProps: {
          flagState: mockFlagState,
          session: `normalizeUndefined(${mockSession})`,
          ...mockExtraProps,
        },
      });
    });
  });
});
