import * as Typedin from "./index";

export interface Injectabe {
  getDiContext(): Typedin.DiContainer;
}