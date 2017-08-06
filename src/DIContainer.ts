import * as Typedin from "./DIRecord";

export type TypeOf<T> = Function & { prototype: T };

export class DIContainer {
  private mParent: DIContainer;
  private mChildren: DIContainer[] = [];
  private mMap: Typedin.DIRecord<any, any>[] = [];
  private mTimestamp: number = 0;

  public constructor(parent?: DIContainer) {
    this.parent = parent;
  }

  public register<KeyT, ValueT>(key: KeyT, value: ValueT): Typedin.DIRecord<KeyT, ValueT> {
		var record = this.getRecord<KeyT, ValueT>(key, false);
		if (!record) {
			record = new Typedin.DIRecord<KeyT, ValueT>(this, key, value);
			this.mMap.push(record);
		} else {
			record.value = value;
    }
    this.updateTimestamp();
    return record;
  }

  public unregister<KeyT>(key: KeyT, checkParents: boolean = false): Typedin.DIRecord<KeyT, any> {
    let record = this.getRecord(key, checkParents);
    if (record) {
      record.container.mMap.splice(record.container.mMap.indexOf(record));
    }
    this.updateTimestamp();
    return record;
  }

  public unregisterAll() {
    this.mMap = [];
    this.updateTimestamp();
  }

  public getRecord<KeyT, ValueT>(key: KeyT, allowParentLookup: boolean = true): Typedin.DIRecord<KeyT, ValueT> {
    let record = this.mMap.find(x => x.key == key);
    if (!record && allowParentLookup && this.mParent) {
      record = this.mParent.getRecord<KeyT, ValueT>(key);
    }
    return record;
  }

  // =======================================
  // Parent-child and timestamp stuff
  // ---------------------------------------

  public get parent(): DIContainer {
    return this.mParent;
  }
  public set parent(parent: DIContainer) {
    let oldParent = this.mParent;
    this.mParent = parent;
    if (oldParent && parent != oldParent) {
      oldParent.mChildren.splice(oldParent.mChildren.indexOf(this));
    }
    if (parent) {
      this.mParent.mChildren.push(this);
    }
  }

  public get timestamp(): number {
    return this.mTimestamp;
  }

  private updateTimestamp() {
    this.mTimestamp++;
    if (this.mChildren) {
      this.mChildren.forEach(x => x.updateTimestamp());
    }
  }

  public dispose() {
    this.unregisterAll();
    this.parent = null;
  }

  // ======================================
  // Services and values helpers
  // --------------------------------------
	
  public registerService<InterfaceT, ImplT>(interfaceType: InterfaceT, instance: ImplT): Typedin.DIRecord<InterfaceT, ImplT> {
    return this.register(interfaceType, instance);
  }
  public getService<T>(interfaceType: TypeOf<T>): T {
    let record = this.getRecord<TypeOf<T>, T>(interfaceType);
    return record && record.value;
  }

  public registerValue<T>(key: string|number, value: T) {
    return this.register(key, value);
  }
  public getValue<T>(key: string|number, defaultValue?: T): T {
    let record = this.getRecord<string|number, T>(key);
    return record && record.value || defaultValue;
  }
}
