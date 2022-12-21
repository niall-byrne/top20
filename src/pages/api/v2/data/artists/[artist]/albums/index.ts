import LastFMApiEndpointFactoryV2 from "@src/backend/api/lastfm/endpoints/v2.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type {
  ApiEndpointRequestType,
  ApiRequestPathParamType,
} from "@src/types/api/request.types";

class ArtistTopAlbums extends LastFMApiEndpointFactoryV2 {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.data.artists.albumsList;

  protected getParams(
    req: ApiEndpointRequestType
  ): [ApiRequestPathParamType, boolean] {
    const params = req.query as ApiRequestPathParamType;
    const error = !params.artist;
    return [params, error];
  }

  protected getProxyResponse = async (params: ApiRequestPathParamType) => {
    return await this.proxy.getArtistTopAlbums(params.artist);
  };
}

export const endpointFactory = new ArtistTopAlbums();
export default endpointFactory.createHandler();
