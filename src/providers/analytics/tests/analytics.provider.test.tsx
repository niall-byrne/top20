import { render } from "@testing-library/react";
import React from "react";
import AnalyticsProvider, { AnalyticsContext } from "../analytics.provider";
import type { AnalyticsContextInterface } from "../../../types/analytics.types";

describe("AnalyticsProvider", () => {
  let received: any = {};

  const arrange = () => {
    render(
      <AnalyticsProvider>
        <AnalyticsContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {Object.keys(state).forEach(function (key) {
                received[key] = state[key as keyof AnalyticsContextInterface];
              })}
            </div>
          )}
        </AnalyticsContext.Consumer>
      </AnalyticsProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should contain the expected properties", () => {
      const properties = received as AnalyticsContextInterface;
      expect(typeof properties.initialized).toBe("boolean");
      expect(typeof properties.setInitialized).toBe("function");
    });
  });
});
