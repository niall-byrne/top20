import LastFMEndpointBase from "@src/backend/api/lastfm/endpoints/bases/endpoint.base.class";
import type { ApiRequestPathParamType } from "@src/types/api/request.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/types/integrations/lastfm/api.types";

export default class ConcreteBaseProxySuccessClass extends LastFMEndpointBase {
  public errorCode?: number;
  public mockError = "mockError";

  public route = "/api/v1/endpoint";
  public timeOut = 100;

  protected setUpHandler(): void {
    this.handler.get(this.route, async (req, res, next) => {
      this.setRequestTimeout(req, res, next);
      const response = await this.getProxyResponse({});
      res.status(200).json(response);
      this.clearRequestTimeout(req);
      next();
    });
  }
  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: ApiRequestPathParamType
  ): Promise<LastFMArtistTopAlbumsInterface[]> {
    return Promise.resolve([]);
  }
}
