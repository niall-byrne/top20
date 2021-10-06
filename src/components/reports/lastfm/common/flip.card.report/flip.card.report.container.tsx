import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import LastFMFlipCardReport from "./flip.card.report.component";
import Events from "../../../../../events/events";
import useAnalytics from "../../../../../hooks/analytics";
import useUserInterface from "../../../../../hooks/ui";
import BillBoardSpinner from "../../../../billboard/billboard.spinner/billboard.spinner.component";
import ErrorDisplay from "../../../../errors/display/error.display.component";
import type UserState from "../../../../../providers/user/encapsulations/user.state.base.class";
import type { ReportType } from "../../../../../types/analytics.types";
import type { userHookAsLastFM } from "../../../../../types/user/hook.types";
import type LastFMBaseReport from "../flip.card.report/flip.card.report.base.class";

interface LastFMFlipCardReportContainerProps<T extends UserState> {
  userName: string;
  user: userHookAsLastFM;
  reportClass: new () => LastFMBaseReport<T>;
}

export default function LastFMFlipCardReportContainer<
  UserStateType extends UserState
>({
  user,
  userName,
  reportClass,
}: LastFMFlipCardReportContainerProps<UserStateType>) {
  const analytics = useAnalytics();
  const { t } = useTranslation("lastfm");
  const router = useRouter();
  const ui = useUserInterface();
  const report = new reportClass();
  const userState = report.getEncapsulatedUserState(user.userProperties, t);

  useEffect(() => {
    ui.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    user.clear();
    report.startDataFetch(user, userName);
    return () => user.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  useEffect(() => {
    if (report.queryIsDataReady(user.userProperties, ui)) {
      user.ready();
      analytics.event(
        Events.LastFM.ReportPresented(report.analyticsReportType as ReportType)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.count, user.userProperties]);

  if (user.userProperties.error === "RatelimitedFetchUser") {
    return (
      <ErrorDisplay
        errorKey={"lastfm_ratelimited"}
        resetError={() => router.reload()}
      />
    );
  }

  if (user.userProperties.error === "NotFoundFetchUser") {
    return (
      <ErrorDisplay
        errorKey={"user_not_found"}
        resetError={() => router.push(report.getRetryRoute())}
      />
    );
  }

  if (user.userProperties.error === "FailureFetchUser") {
    return (
      <ErrorDisplay
        errorKey={"lastfm_communications"}
        resetError={() => router.push(report.getRetryRoute())}
      />
    );
  }

  if (!report.queryUserHasData(user.userProperties)) {
    return (
      <ErrorDisplay
        errorKey={"user_with_no_listens"}
        resetError={() => router.push(report.getRetryRoute())}
      />
    );
  }

  return (
    <>
      <BillBoardSpinner
        title={t(`${String(report.getReportTranslationKey())}.communication`)}
        visible={!user.userProperties.ready}
      />
      <LastFMFlipCardReport<UserStateType>
        DrawerComponent={report.getDrawerComponent()}
        flipCardData={report.getFlipCardData(user.userProperties)}
        imageIsLoaded={ui.load}
        reportTranslationKey={report.getReportTranslationKey() as string}
        userState={userState}
        visible={user.userProperties.ready}
        t={t}
      />
    </>
  );
}
