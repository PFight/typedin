import * as Typedin from "./index";

export interface IHaveConext {
  getDiContext(): Typedin.DiContainer;
}

export function setDiContext(target: IHaveConext | any,
  context: Typedin.DiContainer | (() => Typedin.DiContainer)) {
  if (typeof (context) == "object") {
    target.getDiContext = () => context;
  } else if (typeof (context) == "function") {
    target.getDiContext == context;
  } else {
    throw new Error("Invalid argument 'context'");
  }
}