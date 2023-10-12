import ApiEndpointBase from "../../generic.endpoint.base.class";
import { errorVendorBackend } from "@src/vendors/integrations/errors/vendor.backend";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";

export default class ConcreteBaseProxyErrorClass extends ApiEndpointBase<
  Record<string, never>,
  Promise<number[]>
> {
  protected proxy = {};
  public errorCode?: number;
  public mockError = "mockError";
  public route = "/api/v1/endpoint";
  public timeOut = 100;
  public service = "mockService";

  protected setUpHandler(): void {
    this.handler.get(this.route, async (req, res, next) => {
      this.setRequestTimeout(req, res, next);
      const response = await this.getProxyResponse({}, null);
      res.status(200).json(response);
      next();
    });
  }

  protected getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ApiEndpointRequestQueryParamType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: ApiEndpointRequestBodyType | null
  ): Promise<number[]> {
    throw new errorVendorBackend.ProxyError(this.mockError, this.errorCode);
    return Promise.resolve([]);
  }
}
