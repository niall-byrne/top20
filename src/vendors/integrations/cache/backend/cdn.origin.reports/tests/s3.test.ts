import S3CdnOriginReportsCacheObject from "../s3";

describe(S3CdnOriginReportsCacheObject.name, () => {
  let instance: S3CdnOriginReportsCacheObject;

  beforeEach(() => jest.clearAllMocks());

  const arrange = (
    mockAuthenticatedUserName: string,
    mockReportName: string,
    mockSourceName: string,
    mockUserName: string
  ) => {
    instance = new S3CdnOriginReportsCacheObject({
      authenticatedUserName: mockAuthenticatedUserName,
      reportName: mockReportName,
      sourceName: mockSourceName,
      userName: mockUserName,
    });
  };

  describe("when initialized", () => {
    describe.each([
      [
        "mockReportType1",
        "mockSearchedUser1",
        "mockSource1",
        "mock1@authenticated.com",
        "bW9ja1JlcG9ydFR5cGUxLW1vY2tTZWFyY2hlZFVzZXIx.json",
      ],
      [
        "mockReportType2",
        "mockSearchedUser2",
        "mockSource2",
        "mock2@authenticated.com",
        "bW9ja1JlcG9ydFR5cGUyLW1vY2tTZWFyY2hlZFVzZXIy.json",
      ],
    ])(
      "with: (\n\treport type: %s\n\tsearched user: %s\n\tsource: %s\n\tauth user: %s\n\tbase name: %s\n      )",
      (
        mockReportName,
        mockUserName,
        mockSourceName,
        mockAuthenticatedUserName,
        expectedBaseName
      ) => {
        beforeEach(() =>
          arrange(
            mockAuthenticatedUserName,
            mockReportName,
            mockSourceName,
            mockUserName
          )
        );

        describe("getCacheId", () => {
          let result: string;

          beforeEach(() => (result = instance.getCacheId()));

          it("should return the correct result", () => {
            expect(result).toBe(expectedBaseName.split(".")[0]);
          });
        });

        describe("getStorageName", () => {
          let result: string;

          beforeEach(() => (result = instance.getStorageName()));

          it("should return the correct result", () => {
            expect(result).toBe(
              [
                mockSourceName,
                "reports",
                mockAuthenticatedUserName,
                expectedBaseName,
              ].join("/")
            );
          });
        });
      }
    );
  });
});
