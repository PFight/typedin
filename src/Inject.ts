import * as Typedin from "./index";

/** Decorator, that inject value or service from DIContainer. */
function inject(context: Typedin.DIContainer) {
  return (target: Object, propKey: string) => {
    if (!context)
      throw new Error(`Argument 'context' is not defined in decorator of property '@{propKey}'`);

    const propType = Reflect.getMetadata("design:type", target, propKey);
    let diRecord = context.getRecord(propType);
    const descriptor = {
      get: function () {
        if (!diRecord) {
          diRecord = context.getRecord(propType);
        }
        return diRecord && diRecord.value;
      }
    };
    Object.defineProperty(target, propKey, descriptor);
    return descriptor;
  }
}