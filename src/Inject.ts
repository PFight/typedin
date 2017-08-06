import * as Typedin from "./index";

/**
  * Decorator, that inject value or service from {@link DIContainer} to the class property.
  * @param context Function, that returns {@link DIContainer} or {@link fromSelf} value.
  * @param key Unique idenitifier of the value. When injecting services type of the property will be used as a key.
  */
export function inject<KeyT>(context: () => Typedin.DiContainer, key?: KeyT) {
  return (target: Object, propKey: string) => {
    let recordKey = key !== undefined ? key
      : Reflect.getMetadata("design:type", target, propKey);
    let diRecord: Typedin.DiRecord<KeyT, any>;
    let lastContextTimestamp: number;
    let lastContext: Typedin.DiContainer;
    const descriptor = {
      get: function (this: Typedin.IHaveConext) {
        let currentContext = context && context() ||
          this.getDiContext && this.getDiContext();
        if (!currentContext)
          throw new Error(`Cant inject value: 'context' is not defined in decorator of property '@{propKey}'`);

        if (!diRecord || 
          currentContext != lastContext ||
          currentContext.timestamp != lastContextTimestamp)
        {
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

/**
 * Simple stub for the first parameter of the {@link inject} decorator, means
 * that class implements {@link IHaveCOntext} and that context should be received
 * by calling this.getDiContext().
 */
export const fromSelf: () => Typedin.DiContainer = null;