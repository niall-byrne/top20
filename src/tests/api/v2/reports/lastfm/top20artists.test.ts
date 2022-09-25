import LastFMApiEndpointFactoryV2 from "@src/backend/api/lastfm/v2.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import handleProxy, {
  endpointFactory,
} from "@src/pages/api/v2/reports/lastfm/top20artists/[username]";
import {
  createAPIMocks,
  mockSession,
} from "@src/tests/fixtures/mock.authentication";
import type {
  MockAPIRequest,
  MockAPIResponse,
} from "@src/types/api.endpoint.types";
import type { HttpMethodType } from "@src/types/clients/api/api.client.types";

jest.mock("@src/backend/integrations/lastfm/proxy.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUserTopArtists: mockProxyMethod,
    };
  });
});

jest.mock("@src/backend/api/lastfm/endpoint.common.logger", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("@src/backend/integrations/auth/vendor", () => ({
  Client: jest.fn(() => ({
    getSession: mockGetSession,
  })),
}));

const mockGetSession = jest.fn();
const mockProxyMethod = jest.fn();
const endpointUnderTest = apiRoutes.v2.reports.lastfm.top20artists;

type ArrangeArgs = {
  username: string;
  method: HttpMethodType;
};

describe(endpointUnderTest, () => {
  let mockReq: MockAPIRequest;
  let mockRes: MockAPIResponse;
  const mockResponse = {
    artists: [],
    image: [],
  };
  let username: string;
  let method: HttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const actRequest = async ({ username, method = "GET" }: ArrangeArgs) => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: endpointUnderTest,
      method,
      query: { username },
    }));
    await handleProxy(mockReq, mockRes);
  };

  describe("An instance of the endpoint factory class", () => {
    it("should inherit from LastFMApiEndpointFactoryV2", () => {
      expect(endpointFactory).toBeInstanceOf(LastFMApiEndpointFactoryV2);
    });

    it("should have the correct route set", () => {
      expect(endpointFactory.route).toBe(endpointUnderTest);
    });

    it("should have the correct maxAgeValue set", () => {
      expect(endpointFactory.maxAgeValue).toBe(3600 * 24);
    });

    it("should have flag restrictions bypassed", () => {
      expect(endpointFactory.flag).toBe(null);
    });
  });

  describe("with a valid session", () => {
    beforeEach(() => mockGetSession.mockResolvedValue(mockSession));

    describe("receives a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("with valid data", () => {
        beforeEach(async () => {
          username = "test_user";
        });

        describe("with a valid lastfm response", () => {
          beforeEach(async () => {
            mockProxyMethod.mockReturnValueOnce(Promise.resolve(mockResponse));
            await actRequest({ username, method });
          });

          it("should return a 200 status code", () => {
            expect(mockRes._getStatusCode()).toBe(200);
            expect(mockRes._getJSONData()).toStrictEqual(mockResponse);
          });

          it("should set a Cache-Control header", () => {
            expect(mockRes._getHeaders()["cache-control"]).toStrictEqual([
              "public",
              `max-age=${endpointFactory.maxAgeValue}`,
            ]);
          });

          it("should call the proxy method with the correct params", () => {
            expect(mockProxyMethod).toBeCalledWith(username);
          });
        });
      });
    });
  });
});
