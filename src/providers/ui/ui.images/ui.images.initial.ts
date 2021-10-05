import { voidFn } from "../../../utils/voids";
import type { UserInterfaceImagesContextInterface } from "../../../types/ui.types";

const InitialValues = <UserInterfaceImagesContextInterface>{
  loadedCount: 0,
  setLoadedCount: voidFn,
};

export default InitialValues;
