import { waitFor } from "@testing-library/react";
import LastFMBaseSunBurstDataPointClient from "../sunburst.datapoint.client.base.class";
import EventDefinition from "@src/events/event.class";
import InitialState from "@src/providers/user/user.initial";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/types/clients/api/lastfm/response.types";

jest.mock("@src/clients/api/api.client.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      request: mockRequest,
    };
  });
});

const mockRequest = jest.fn();
const mockDispatch = jest.fn();
const mockEvent = jest.fn();

const mockState = {
  errorMessage: "Mock Error Message",
  lastfmPrefix: "A url to lastfm",
  userProperties: JSON.parse(JSON.stringify(InitialState)),
  getReportContent: jest.fn(),
  getReport: jest.fn(),
  getReportStatus: jest.fn(),
  getDispatchState: jest.fn(),
  updateWithResponse: jest.fn(),
  getProfileImageUrl: jest.fn(),
  getNextStep: jest.fn(),
  throwError: jest.fn(),
  removeEntity: jest.fn(),
};

class ConcreteLastFMBaseSunBurstDataClient<
  ReportType
> extends LastFMBaseSunBurstDataPointClient<jest.Mock, ReportType> {
  route = "/api/v2/some/route/:username";
}

describe("LastFMBaseSunBurstDataClient", () => {
  const mockUserParams = { userName: "user1234" };
  const mockParamWithArtist = { ...mockUserParams, artist: "Mock Artist" };
  const mockAPIResponse = { data: "mocked data" };
  const integrationType = "LAST.FM";
  const reportType = "BASE";
  let instance: ConcreteLastFMBaseSunBurstDataClient<LastFMTopAlbumsReportResponseInterface>;
  const requestEvent = new EventDefinition({
    category: "LAST.FM",
    label: "REQUEST",
    action: `${reportType}: REQUEST WAS SENT TO LAST.FM.`,
  });
  const responseEvent = new EventDefinition({
    category: "LAST.FM",
    label: "RESPONSE",
    action: `${reportType}: RECEIVED RESPONSE FROM LAST.FM.`,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    const report =
      new ConcreteLastFMBaseSunBurstDataClient<LastFMTopAlbumsReportResponseInterface>(
        mockDispatch,
        mockEvent,
        mockState
      );
    return report;
  };

  const checkUrl = () => {
    it("should make the request with the correct url", () => {
      expect(mockRequest).toBeCalledTimes(1);
      expect(mockRequest).toBeCalledWith(
        instance.route?.replace(":username", mockUserParams.userName)
      );
    });
  };

  const setUpRetrieve = (success: boolean, status: number, headers = {}) => {
    if (success) {
      mockRequest.mockResolvedValueOnce({
        status: status,
        headers: headers,
        response: mockAPIResponse,
      });
    } else {
      mockRequest.mockRejectedValueOnce({});
    }
  };

  describe("retrieveReport", () => {
    const mockCompleteReport = { report: "complete" };
    const mockInCompleteReport = { report: "incomplete" };

    describe("when a request is successful", () => {
      beforeEach(() => {
        setUpRetrieve(true, 200);
      });

      describe("when the report is complete", () => {
        beforeEach(() => {
          mockState.getReportStatus.mockImplementation(() => ({
            complete: true,
          }));
          mockState.getDispatchState.mockImplementation(
            () => mockCompleteReport
          );
        });

        describe("when called with initial params", () => {
          beforeEach(() => {
            instance = arrange();
            instance.retrieveReport(mockUserParams);
          });

          checkUrl();

          it("should attempt to update the report based on the api response", () => {
            expect(mockState.updateWithResponse).toBeCalledTimes(1);
            expect(mockState.updateWithResponse).toBeCalledWith(
              mockAPIResponse,
              mockUserParams,
              instance.route
            );
          });

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "StartFetch",
              userName: mockUserParams.userName,
              integration: integrationType,
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "SuccessFetch",
              userName: mockUserParams.userName,
              data: mockCompleteReport,
              integration: integrationType,
            });
          });

          it("should register events correctly", async () => {
            await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
            expect(mockEvent).toHaveBeenCalledWith(requestEvent);
            expect(mockEvent).toHaveBeenCalledWith(
              new EventDefinition({
                category: "LAST.FM",
                label: "RESPONSE",
                action: `${reportType}: RECEIVED RESPONSE FROM LAST.FM.`,
              })
            );
          });
        });

        describe("when called with non-initial params", () => {
          beforeEach(() => {
            mockState.getReportStatus.mockImplementation(() => ({
              complete: true,
            }));
            mockState.getDispatchState.mockImplementation(
              () => mockCompleteReport
            );
            instance = arrange();
            instance.retrieveReport(mockParamWithArtist);
          });

          checkUrl();

          it("should attempt to update the report based on the api response", () => {
            expect(mockState.updateWithResponse).toBeCalledTimes(1);
            expect(mockState.updateWithResponse).toBeCalledWith(
              mockAPIResponse,
              mockParamWithArtist,
              instance.route
            );
          });

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointStartFetch",
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "SuccessFetch",
              userName: mockParamWithArtist.userName,
              data: mockCompleteReport,
              integration: integrationType,
            });
          });

          it("should register events correctly", async () => {
            await waitFor(() => expect(mockEvent).toBeCalledTimes(1));
            expect(mockEvent).toHaveBeenCalledWith(responseEvent);
          });
        });
      });

      describe("when the report is not complete", () => {
        beforeEach(() => {
          mockState.getReportStatus.mockImplementation(() => ({
            complete: false,
          }));
          mockState.getDispatchState.mockImplementation(
            () => mockInCompleteReport
          );
        });

        describe("when called with initial params", () => {
          beforeEach(() => {
            instance = arrange();
            instance.retrieveReport(mockUserParams);
          });

          checkUrl();

          it("should attempt to update the report based on the api response", () => {
            expect(mockState.updateWithResponse).toBeCalledTimes(1);
            expect(mockState.updateWithResponse).toBeCalledWith(
              mockAPIResponse,
              mockUserParams,
              instance.route
            );
          });

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "StartFetch",
              userName: mockUserParams.userName,
              integration: integrationType,
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointSuccessFetch",
              data: mockInCompleteReport,
            });
          });

          it("should register events correctly", async () => {
            await waitFor(() => expect(mockEvent).toBeCalledTimes(1));
            expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          });
        });

        describe("when called with NON initial params", () => {
          beforeEach(() => {
            instance.retrieveReport(mockParamWithArtist);
          });

          checkUrl();

          it("should attempt to update the report based on the api response", () => {
            expect(mockState.updateWithResponse).toBeCalledTimes(1);
            expect(mockState.updateWithResponse).toBeCalledWith(
              mockAPIResponse,
              mockParamWithArtist,
              instance.route
            );
          });

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointStartFetch",
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointSuccessFetch",
              data: mockInCompleteReport,
            });
          });

          it("should register events correctly", async () => {
            await waitFor(() => expect(mockEvent).toBeCalledTimes(0));
          });
        });
      });
    });

    describe("when a request fails", () => {
      beforeEach(() => {
        setUpRetrieve(false, 400);
        mockState.getDispatchState.mockImplementation(() => mockCompleteReport);
      });

      describe("when called with initial params", () => {
        beforeEach(() => {
          instance = arrange();
          instance.retrieveReport(mockUserParams);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "FailureFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should NOT remove the entity", () => {
          expect(mockState.removeEntity).toBeCalledTimes(0);
        });

        it("should register events correctly", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          expect(mockEvent).toHaveBeenCalledWith(
            new EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: ERROR DURING REQUEST.`,
            })
          );
        });
      });

      describe("when called with NON initial params", () => {
        beforeEach(() => {
          instance = arrange();
          instance.retrieveReport(mockParamWithArtist);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointStartFetch",
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointFailureFetch",
            data: mockCompleteReport,
          });
        });

        it("should remove the entity", () => {
          expect(mockState.removeEntity).toBeCalledTimes(1);
          expect(mockState.removeEntity).toBeCalledWith(mockParamWithArtist);
        });

        it("should register events correctly", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(0));
        });
      });
    });

    describe("when a request is unauthorized", () => {
      beforeEach(() => {
        setUpRetrieve(true, 401);
      });

      describe("when called with initial params", () => {
        beforeEach(() => {
          mockState.getDispatchState.mockImplementation(
            () => mockCompleteReport
          );
          instance = arrange();
          instance.retrieveReport(mockUserParams);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "UnauthorizedFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should register events correctly", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          expect(mockEvent).toHaveBeenCalledWith(
            new EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: AN UNAUTHORIZED REQUEST WAS MADE.`,
            })
          );
        });
      });

      describe("when called with NON initial params", () => {
        beforeEach(() => {
          mockState.getDispatchState.mockImplementation(
            () => mockCompleteReport
          );
          instance = arrange();
          instance.retrieveReport(mockParamWithArtist);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointStartFetch",
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "UnauthorizedFetch",
            userName: mockParamWithArtist.userName,
            integration: integrationType,
          });
        });

        it("should register events correctly", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(1));
          expect(mockEvent).toHaveBeenCalledWith(
            new EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: AN UNAUTHORIZED REQUEST WAS MADE.`,
            })
          );
        });
      });
    });

    describe("when a request returns not found", () => {
      beforeEach(() => {
        setUpRetrieve(true, 404);
        mockState.getDispatchState.mockImplementation(() => mockCompleteReport);
        instance = arrange();
      });

      describe("when called with initial params", () => {
        beforeEach(() => {
          instance.retrieveReport(mockUserParams);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "NotFoundFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should NOT remove the entity", () => {
          expect(mockState.removeEntity).toBeCalledTimes(0);
        });

        it("should register events correctly", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          expect(mockEvent).toHaveBeenCalledWith(
            new EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: REQUEST WAS MADE FOR AN UNKNOWN ENTITY.`,
            })
          );
        });
      });

      describe("when called with NON initial params", () => {
        beforeEach(() => {
          instance.retrieveReport(mockParamWithArtist);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointStartFetch",
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointNotFoundFetch",
            data: mockCompleteReport,
          });
        });

        it("should remove the entity", () => {
          expect(mockState.removeEntity).toBeCalledTimes(1);
          expect(mockState.removeEntity).toBeCalledWith(mockParamWithArtist);
        });

        it("should register events correctly", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(0));
        });
      });
    });

    describe("when a request is ratelimited", () => {
      beforeEach(() => {
        setUpRetrieve(true, 429);
      });

      describe("when called with initial params", () => {
        beforeEach(() => {
          instance = arrange();
          instance.retrieveReport(mockUserParams);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "RatelimitedFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should register events correctly", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          expect(mockEvent).toHaveBeenCalledWith(
            new EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: REQUEST WAS RATELIMITED BY LAST.FM.`,
            })
          );
        });
      });

      describe("when called with NON initial params", () => {
        beforeEach(() => {
          instance = arrange();
          instance.retrieveReport(mockParamWithArtist);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointStartFetch",
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "RatelimitedFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should register events correctly", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(1));
          expect(mockEvent).toHaveBeenCalledWith(
            new EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: REQUEST WAS RATELIMITED BY LAST.FM.`,
            })
          );
        });
      });
    });

    describe("when a request time out", () => {
      beforeEach(() => {
        mockState.getDispatchState.mockImplementation(
          () => mockInCompleteReport
        );
        instance = arrange();
      });

      const waitForBackoff = async () => {
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
      };

      describe("with a retry header", () => {
        beforeEach(() => {
          setUpRetrieve(true, 503, { "retry-after": "0" });
        });

        describe("when called with initial params", () => {
          beforeEach(async () => {
            instance = arrange();
            instance.retrieveReport(mockUserParams);
            await waitForBackoff();
          });

          checkUrl();

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "StartFetch",
              userName: mockUserParams.userName,
              integration: integrationType,
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointTimeoutFetch",
            });
          });

          it("should NOT register events", async () => {
            await waitFor(() => expect(mockEvent).toBeCalledTimes(1));
            expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          });
        });

        describe("when called with NON initial params", () => {
          beforeEach(async () => {
            instance = arrange();
            instance.retrieveReport(mockParamWithArtist);
            await waitForBackoff();
          });

          checkUrl();

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointStartFetch",
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointTimeoutFetch",
            });
          });

          it("should NOT register events", async () => {
            await waitFor(() => expect(mockEvent).toBeCalledTimes(0));
          });
        });
      });

      describe("without a retry header", () => {
        beforeEach(() => {
          setUpRetrieve(true, 503);
        });

        describe("when called with initial params", () => {
          beforeEach(async () => {
            instance = arrange();
            instance.retrieveReport(mockUserParams);
            await waitForBackoff();
          });

          checkUrl();

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "StartFetch",
              userName: mockUserParams.userName,
              integration: integrationType,
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "FailureFetch",
              userName: mockUserParams.userName,
              integration: integrationType,
            });
          });

          it("should register a failure event", async () => {
            await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
            expect(mockEvent).toHaveBeenCalledWith(requestEvent);
            expect(mockEvent).toHaveBeenCalledWith(
              new EventDefinition({
                category: "LAST.FM",
                label: "ERROR",
                action: `${reportType}: ERROR DURING REQUEST.`,
              })
            );
          });
        });

        describe("when called with NON initial params", () => {
          beforeEach(async () => {
            instance = arrange();
            instance.retrieveReport(mockParamWithArtist);
            await waitForBackoff();
          });

          checkUrl();

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointStartFetch",
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "FailureFetch",
              userName: mockParamWithArtist.userName,
              integration: integrationType,
            });
          });

          it("should register a failure event", async () => {
            await waitFor(() => expect(mockEvent).toBeCalledTimes(1));
            expect(mockEvent).toHaveBeenCalledWith(
              new EventDefinition({
                category: "LAST.FM",
                label: "ERROR",
                action: `${reportType}: ERROR DURING REQUEST.`,
              })
            );
          });
        });
      });
    });
  });
});
