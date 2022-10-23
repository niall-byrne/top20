import webFrameworkVendor from "@src/clients/web.framework/vendor";
import Condition from "@src/components/condition/condition.component";
import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import ErrorDisplay from "@src/components/errors/display/error.display.component";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import useRouter from "@src/hooks/router";
import pagePropsGenerator from "@src/utils/page.props.static";
import { voidFn } from "@src/utils/voids";

export default function Custom404() {
  const router = useRouter();

  const goHome = () => {
    router.push(routes.home);
  };

  return (
    <Condition isTrue={!webFrameworkVendor.isBuildTime()}>
      <ErrorBoundary
        eventDefinition={Events.General.Error}
        route={routes.home}
        stateReset={voidFn}
      >
        <ErrorDisplay errorKey={"404"} resetError={goHome} />
      </ErrorBoundary>
    </Condition>
  );
}

export const getStaticProps = pagePropsGenerator({ pageKey: "default" });
