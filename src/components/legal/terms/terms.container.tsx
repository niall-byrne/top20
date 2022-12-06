import FooterComponent from "./inlays/terms.footer.component";
import HeaderComponent from "./inlays/terms.header.component";
import ToggleComponent from "./inlays/terms.toggle.component";
import DialogueContainer from "@src/components/dialogues/resizable/dialogue.resizable.container";
import useLocale from "@src/hooks/locale.hook";

export default function TermsOfService() {
  const { t } = useLocale("legal");

  return (
    <DialogueContainer
      FooterComponent={FooterComponent}
      HeaderComponent={HeaderComponent}
      t={t}
      titleText={t("termsOfService.title")}
      ToggleComponent={ToggleComponent}
    />
  );
}
