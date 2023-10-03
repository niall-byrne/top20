import isNextBuildTime from "./web/build/next";
import NextHeaderComponent from "./web/head/next";
import useNextRouter from "./web/hooks/next";
import NextImageShim from "./web/image/next";
import reducerLoggingMiddleware from "./web/reducers/middlewares/reducer.logger";
import applyMiddleware from "./web/reducers/reducer.middleware";
import isNextSSR from "./web/ssr/next";
import type { WebFrameworkVendorInterface } from "@src/vendors/types/integrations/web.framework/vendor.types";

export const webFrameworkVendor: WebFrameworkVendorInterface = {
  HeadShim: NextHeaderComponent,
  ImageShim: NextImageShim,
  isBuildTime: isNextBuildTime,
  isSSR: isNextSSR,
  routerHook: useNextRouter,
  reducers: {
    applyMiddleware,
    middlewares: {
      logger: reducerLoggingMiddleware,
    },
  },
};
