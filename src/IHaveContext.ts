import * as Typedin from "./index";

/** 
  * Interface, that describes a class with associated [DiContainer]{@link DiContainer}.
  *
  * **Note**: You can use [setDiContext]{@link setDiContext} function instead of implementing the interface.
  *
  */
export interface IHaveConext {
  /** Returns associated dependency injection container. */
  getDiContext(): Typedin.DiContainer;
}

/**
 * Associates [DiContainer]{@link DiContainer} with specified object.
 *
 * @param target Object to associate container with.
 * @param context Dependency injection container or function, that returns it.
 */
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