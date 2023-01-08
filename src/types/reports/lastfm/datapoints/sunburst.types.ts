import type SunburstDataPointClient from "@src/clients/api/lastfm/data/sunburst/datapoints/sunburst.datapoint.client.base.class";
import type UserSunBurstReportBaseState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { EventCreatorType } from "@src/types/analytics.types";
import type { userDispatchType } from "@src/types/user/context.types";

export type SunBurstDataPointClientConstructor<EncapsulationType> = {
  new (
    dispatch: userDispatchType,
    event: EventCreatorType,
    encapsulatedState: UserSunBurstReportBaseState<EncapsulationType>
  ): SunburstDataPointClient<EncapsulationType, unknown>;
};
