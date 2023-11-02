import { render } from "@testing-library/react";
import SplashFooter from "../splash.footer.component";
import dialogueSettings from "@src/config/dialogue";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockUseRouter from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import Button from "@src/web/ui/generics/components/buttons/button.standard/button.standard.component";

jest.mock(
  "@src/web/ui/generics/components/buttons/button.standard/button.standard.component",
  () => require("@fixtures/react/parent").createComponent("Button")
);

describe("SplashFooter", () => {
  const mockT = new MockUseTranslation("splash").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<SplashFooter router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Button with the correct props", () => {
      expect(Button).toHaveBeenCalledTimes(1);
      checkMockCall(Button, {
        ...dialogueSettings.buttonComponentProps,
        analyticsName: "Splash Page Start",
      });
    });
  });
});
