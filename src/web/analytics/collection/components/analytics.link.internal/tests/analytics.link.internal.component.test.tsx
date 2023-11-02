import { render, screen, fireEvent } from "@testing-library/react";
import AnalyticsInternalLinkWrapper from "../analytics.link.internal.component";

describe("AnalyticsInternalLinkWrapper", () => {
  const buttonText = "Click Me";

  const mockAnalyticsClick = jest.fn();
  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsInternalLinkWrapper clickHandler={mockAnalyticsClick}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsInternalLinkWrapper>
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

    it("should call the button click handler", () => {
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it("should call the button tracker", () => {
      expect(mockAnalyticsClick).toHaveBeenCalledTimes(1);
    });
  });
});
