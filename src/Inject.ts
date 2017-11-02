import * as Typedin from "./index";

const DiContextMetadataKey = "Typedin_DiContext";

/**
  * Decorator, that inject value from [DIContainer]{@link DIContainer} to the class property.
  * @param key Unique idenitifier of the value. When injecting services type of the property will be used as a key.
  */
export function injectThe<KeyT>(key?: KeyT) {
  return (target: Object, propKey: string) => {
    let recordKey = key !== undefined ? key
      : Reflect.getMetadata("design:type", target, propKey);
    let context;
    let diRecord: Typedin.DiRecord<KeyT, any>;
    let lastContextTimestamp: number;
    let lastContext: Typedin.DiContainer;
    const descriptor = {
      get: function (this: Typedin.IHaveConext) {
        if (context === undefined) {
          context = Reflect.getMetadata(DiContextMetadataKey, target) as any;
        }
        let currentContext = this.getDiContext && this.getDiContext()
          || context && context()
          || Typedin.Global;

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
 * Decorator, that inject service from [DIContainer]{@link DIContainer} to the class property
 * using property type as a key.
 */
export function inject(target: Object, propKey: string) {
  return injectThe()(target, propKey);
}

/**
 * Decorator ,that associates context with a class.
 * @param context Function, that returns [DIContainer]{@link DIContainer}.
 */
export function DiContext(context: () => Typedin.DiContainer): any {
  return (target: Function) => {
    const classPrototype = target.prototype;
    Reflect.defineMetadata(DiContextMetadataKey, context, classPrototype);
    console.info("protype", classPrototype);
    return target;
  }
}