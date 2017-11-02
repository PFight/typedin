import * as Typedin from "./index";

/**
 * Record in [DiContainer]{@link DiContainer}. Stores key and value.
 */
export class DiRecord<KeyT, ValueT> {
  private mKey: KeyT;
  private mValue: ValueT;
  private mContainer: Typedin.DiContainer;

  constructor(container: Typedin.DiContainer, key: KeyT, value: ValueT) {
		this.mKey = key;
		this.mValue = value;
	}

  /** Key to indetify value in [DiContainer]{@link DiContainer} */
  get key(): KeyT {
		return this.mKey;
	}

  /** Dependency value, that should be injected. */
  get value(): ValueT {
		return this.mValue;
	}
  set value(val: ValueT) {
		this.mValue = val;
	}

  /** Container, where record stored. */
  get container(): Typedin.DiContainer {
    return this.mContainer;
  }
}
