import * as Typedin from "./index";

/** Decorator, that inject value or service from DIContainer. */
export function inject<KeyT>(context: () => Typedin.DIContainer, key?: KeyT) {
  return (target: Object, propKey: string) => {
    const recordKey = key || Reflect.getMetadata("design:type", target, propKey);
    let diRecord = context && context() && context().getRecord(recordKey);
    const descriptor = {
      get: function () {
        if (!context || !context())
          throw new Error(`Cant inject value: 'context' is not defined in decorator of property '@{propKey}'`);

        if (!diRecord) {
          diRecord = context().getRecord(recordKey);
        }
        return diRecord && diRecord.value;
      }
    };
    Object.defineProperty(target, propKey, descriptor);
    return descriptor as any;
  }
}