import ConditionalErrorDisplayBase from "./error.condition.display.base.class";
import Authentication from "@src/components/authentication/authentication.container";

class AuthenticationErrorConditionalDisplay<
  ReportType
> extends ConditionalErrorDisplayBase<ReportType> {
  error = "UnauthorizedFetch" as const;

  component = () => <Authentication />;
}

export default AuthenticationErrorConditionalDisplay;
