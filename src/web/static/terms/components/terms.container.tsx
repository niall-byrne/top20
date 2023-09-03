import FooterComponent from "./inlays/terms.footer.component";
import HeaderComponent from "./inlays/terms.header.component";
import ToggleComponent from "./inlays/terms.toggle.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import DialogueContainer from "@src/web/ui/generics/components/dialogues/resizable/dialogue.resizable.container";

export default function TermsOfService() {
  const { t } = useTranslation("legal");

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
