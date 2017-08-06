import * as Typedin from "./index";

/** Decorator, that inject value or service from DIContainer. */
export function inject<KeyT>(context: () => Typedin.DiContainer, key?: KeyT) {
  return (target: Object, propKey: string) => {
    let recordKey = key !== undefined ? key
      : Reflect.getMetadata("design:type", target, propKey);
    let diRecord: Typedin.DiRecord<KeyT, any>;
    let lastContextTimestamp: number;
    let lastContext: Typedin.DiContainer = context && context();
    if (lastContext) {
      diRecord = lastContext.getRecord(recordKey);
      lastContextTimestamp = lastContext.timestamp;
    }
    const descriptor = {
      get: function () {
        if (!context || !context())
          throw new Error(`Cant inject value: 'context' is not defined in decorator of property '@{propKey}'`);
        let currentContext = context();
        if (!diRecord || 
          currentContext != lastContext ||
          currentContext.timestamp != lastContextTimestamp) {
          lastContext = currentContext;
          lastContextTimestamp = currentContext.timestamp;
          diRecord = currentContext.getRecord(recordKey);
        }
        return diRecord && diRecord.value;
      }
    };
    Object.defineProperty(target, propKey, descriptor);
    return descriptor as any;
  }
}