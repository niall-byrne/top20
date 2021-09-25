import LastFMClientAdapter from "../client.class";
import type { ProxyError } from "../../../errors/proxy.error.class";
import type {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "../../../types/integrations/lastfm/api.types";
import type { LastFMExternalClientError } from "../../../types/integrations/lastfm/client.types";

jest.mock("@toplast/lastfm", () => {
  return jest.fn().mockImplementation(() => {
    return {
      user: {
        getTopAlbums: mockApiCall,
        getInfo: mockApiCall,
      },
    };
  });
});

const mockApiCall = jest.fn();

describe("LastFMClient", () => {
  let secretKey: "123VerySecret";
  let username: "testuser";
  const mockTopAlbumsResponse = { topalbums: { album: "response" } };
  const mockInfoResponse = { user: { image: "response" } };
  let instance: LastFMClientAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (secretKey: string) => {
    return new LastFMClientAdapter(secretKey);
  };

  describe("getTopAlbums", () => {
    let res: LastFMAlbumDataInterface[];

    describe("when the request is successful", () => {
      beforeEach(async () => {
        mockApiCall.mockReturnValueOnce(Promise.resolve(mockTopAlbumsResponse));
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getTopAlbums(username);
        expect(mockApiCall).toBeCalledTimes(1);
        expect(mockApiCall).toBeCalledWith({
          user: username,
          period: instance.reportAlbumPeriod,
          limit: instance.reportAlbumCount,
          page: 1,
        });
        expect(res).toBe(mockTopAlbumsResponse.topalbums.album);
      });
    });

    describe("when the request errors", () => {
      let err: LastFMExternalClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMExternalClientError;
      });

      describe("with a status code", () => {
        beforeEach(async () => {
          err.statusCode = 999;
          mockApiCall.mockImplementationOnce(() => Promise.reject(err));
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopAlbums(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect((receivedError as ProxyError).clientStatusCode).toBe(
              err.statusCode
            );
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(async () => {
          mockApiCall.mockImplementationOnce(() => Promise.reject(err));
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopAlbums(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect(
              (receivedError as ProxyError).clientStatusCode
            ).toBeUndefined();
          }
        });
      });
    });
  });

  describe("getUserImage", () => {
    let res: LastFMImageDataInterface[];

    describe("when the request is successful", () => {
      beforeEach(async () => {
        mockApiCall.mockReturnValueOnce(Promise.resolve(mockInfoResponse));
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getUserImage(username);
        expect(mockApiCall).toBeCalledTimes(1);
        expect(mockApiCall).toBeCalledWith({
          user: username,
        });
        expect(res).toBe(mockInfoResponse.user.image);
      });
    });

    describe("when the request errors", () => {
      let err: LastFMExternalClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMExternalClientError;
      });

      describe("with a status code", () => {
        beforeEach(async () => {
          err.statusCode = 999;
          mockApiCall.mockImplementationOnce(() => Promise.reject(err));
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getUserImage(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect((receivedError as ProxyError).clientStatusCode).toBe(
              err.statusCode
            );
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(async () => {
          mockApiCall.mockImplementationOnce(() => Promise.reject(err));
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getUserImage(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect(
              (receivedError as ProxyError).clientStatusCode
            ).toBeUndefined();
          }
        });
      });
    });
  });
});
