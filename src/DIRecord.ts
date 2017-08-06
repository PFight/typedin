import * as Typedin from "./index";

export class DiRecord<KeyT, ValueT> {
  private mKey: KeyT;
  private mValue: ValueT;
  private mTimestamp: number = 0;
  private mContainer: Typedin.DiContainer;

  constructor(container: Typedin.DiContainer, key: KeyT, value: ValueT) {
		this.mKey = key;
		this.mValue = value;
	}

  get key(): KeyT {
		return this.mKey;
	}
	
  get value(): ValueT {
		return this.mValue;
	}
  set value(val: ValueT) {
		this.mValue = val;
		this.mTimestamp++;
	}

	get timestamp(): number {
		return this.mTimestamp;
	}

  get container(): Typedin.DiContainer {
    return this.mContainer;
  }
}
