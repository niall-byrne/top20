import { render, screen, fireEvent } from "@testing-library/react";
import AnalyticsLinkComponent from "../analytics.link.external.component";
import mockAnalyticsHook from "@src/hooks/tests/analytics.mock.hook";

jest.mock("@src/hooks/analytics", () => () => mockAnalyticsHook);

describe("AnalyticsExternalLink", () => {
  const buttonText = "Click Me";
  const mockLinkName = "test button";
  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsLinkComponent href={mockLinkName}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsLinkComponent>
    );
  };

  it("should render test button as expected", async () => {
    expect(await screen.findByText(buttonText)).toBeTruthy();
  });

  describe("when the test button is clicked", () => {
    beforeEach(async () => {
      const link = await screen.findByText(buttonText);
      expect(link).not.toBeNull();
      fireEvent.click(link as HTMLElement);
    });

    it("should call the button tracker", () => {
      expect(mockAnalyticsHook.trackExternalLinkClick).toBeCalledTimes(1);
      const call = mockAnalyticsHook.trackExternalLinkClick.mock.calls[0];
      expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
      expect(call[1]).toBe(mockLinkName);
      expect(Object.keys(call).length).toBe(2);
    });
  });
});
