import * as Typedin from "./DIRecord";

export type ClassConstructor<T> = { new (): T; }

export class DIContainer {
  private mParent: DIContainer;
	private mMap: Typedin.DIRecord<any, any>[] = [];

  public constructor(parent?: DIContainer) {
    this.mParent = parent;
  }

  public get parent(): DIContainer {
    return this.mParent;
  }
  public set parent(parent: DIContainer) {
    this.mParent = parent;
  }

  public register<KeyT, ValueT>(key: KeyT, value: ValueT): Typedin.DIRecord<KeyT, ValueT> {
		var record = this.getRecord<KeyT, ValueT>(key, false);
		if (!record) {
			record = new Typedin.DIRecord<KeyT, ValueT>(this, key, value);
			this.mMap.push(record);
		} else {
			record.value = value;
    }
    return record;
	}

  public getRecord<KeyT, ValueT>(key: KeyT, allowParentLookup: boolean = true): Typedin.DIRecord<KeyT, ValueT> {
    let record = this.mMap.find(x => x.key == key);
    if (!record && allowParentLookup && this.mParent) {
      record = this.mParent.getRecord<KeyT, ValueT>(key);
    }
    return record;
	}

	
  public registerService<T>(interfaceType: ClassConstructor<T>, instance: T): Typedin.DIRecord<ClassConstructor<T>, T> {
    return this.register(interfaceType, instance);
  }
  public getService<T>(interfaceType: ClassConstructor<T>): T {
    let record = this.getRecord <ClassConstructor<T>, T>(interfaceType);
    return record && record.value;
  }

  public registerValue<T>(key: string, value: T) {
    return this.register(key, value);
  }
  public getValue<T>(key: string, defaultValue?: T): T {
    let record = this.getRecord<string, T>(key);
    return record && record.value || defaultValue;
  }
}