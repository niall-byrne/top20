import { useRouter } from "next/router";
import type { VendorRouterHookInterface } from "@src/types/clients/web.framework/vendor.types";

const useNextRouter = () => {
  const router = useRouter();

  const back = router.back;
  const push = (url: string) => router.push(url);
  const reload = () => router.reload();
  const addRouteChangeHandler = (cb: (url: string) => void) =>
    router.events.on("routeChangeStart", cb);
  const removeRouteChangeHandler = (cb: (url: string) => void) =>
    router.events.off("routeChangeStart", cb);

  return {
    back,
    handlers: {
      addRouteChangeHandler,
      removeRouteChangeHandler,
    },
    path: router.pathname,
    push,
    reload,
  } as VendorRouterHookInterface;
};

export default useNextRouter;
