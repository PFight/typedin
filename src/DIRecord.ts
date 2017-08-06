import * as Typedin from "./index";

export class DIRecord<KeyT, ValueT> {
  private mKey: KeyT;
  private mValue: ValueT;
  private mTimestamp: number = 0;
  private mContainer: Typedin.DIContainer;

  constructor(container: Typedin.DIContainer, key: KeyT, value: ValueT) {
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

  get container(): Typedin.DIContainer {
    return this.mContainer;
  }
}
